# Offline Functionality — Specification

**Source:** `specs/01-offline-brainstorming.md`

---

## 1. Goals

| Goal | Detail |
|------|--------|
| App usable when offline | No crash screen; notes load from localStorage |
| Full navigation offline | All routes accessible via service worker |
| Changes survive disconnection | Offline writes synced to server on reconnect |
| Silent failures elsewhere | RSS/weather/location degrade gracefully, no crashes |

---

## 2. Decisions Summary

| # | Decision |
|---|----------|
| Q1 | App shows normally offline — no offline indicator |
| Q2 | Notes are the only critical offline data; RSS/weather/location fail silently |
| Q3 | Conflict resolution: last-write-wins on `edited_at` timestamp |
| Q4 | No separate pending queue — localStorage note data is used directly on reconnect |
| Q5 | Offline deletions not supported — deleted note reappears on reconnect (accepted limitation) |
| Q6 | Reconnect sync triggered by `window online` event |
| Q7 | Existing spinner (SyncStore) reused — no extra UI feedback |
| Q8 | Add `navigateFallback: '/'` to Workbox so all offline navigation works |
| Q9 | No `error.vue` — fix root causes so errors never reach crash screen |
| Q10 | Sync algorithm: push local-only + locally-newer notes → then fetchAll |
| Q11 | Suppress auth redirect to `/` when offline (keep user on current page) |
| Q12 | Consistent try/catch + `navigator.onLine` guards across all stores |
| Q13 | Always call `initIdleFetch` — move online check inside callback |

---

## 3. Architecture

### 3.1 Offline Data Flow

```
User edits note (offline)
        │
        ▼
localStorage updated immediately          ← already works today
Supabase call skipped (navigator.onLine)  ← already works today
        │
        ▼
    [offline period]
        │
        ▼
window 'online' event fires
        │
        ▼
syncLocalToServer()                       ← NEW
  ├─ fetch all notes from Supabase
  ├─ for each local note NOT on server    → upsert to Supabase (offline creates)
  └─ for each local note on server
       └─ if local.edited_at > server.edited_at → upsert to Supabase (offline edits)
        │
        ▼
noteStore.fetchAll()                      ← existing, now called after sync
  └─ overwrites localStorage with merged server state
```

### 3.2 Known Limitation

Offline deletions are not supported. If the user deletes a note while offline, it is removed from localStorage but the Supabase record is untouched. On reconnect `fetchAll()` restores the note. This is accepted.

---

## 4. Implementation Plan

### 4.1 `nuxt.config.ts` — Service Worker Navigate Fallback

Add `navigateFallback` to the Workbox config so the PWA service worker serves the cached SPA shell for every navigation request when offline. Without this, clicking any link while offline results in a browser network error page.

```ts
workbox: {
  globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
  maximumFileSizeToCacheInBytes: 3000000,
  navigateFallback: "/",                        // ADD THIS
},
```

---

### 4.2 `stores/NoteStore.ts` — Reconnect Sync

Add a `syncLocalToServer()` function. This is called once when the `online` event fires, before `fetchAll()`.

```
syncLocalToServer():
  1. Fetch all notes from Supabase for the current user
  2. Build a Map<id, serverNote> from server results
  3. For each local note:
     a. If not in server map → upsert (created offline)
     b. If in server map AND local.edited_at > server.edited_at → upsert (edited offline)
  4. Return (fetchAll is called by the caller after this)
```

Edge cases:
- If `edited_at` is null on either side: treat null as older than any real timestamp
- If Supabase upsert fails: log the error and continue (best-effort sync)
- If the user has zero local notes: skip and go straight to fetchAll

---

### 4.3 `app.vue` — Online Event Listener + Idle Fetch Fix

Two changes:

**a) Online event listener** — when the browser reconnects, run sync then re-fetch:

```
window.addEventListener('online', async () => {
  await noteStore.syncLocalToServer()
  await noteStore.fetchAll()
  await rssStore.fetchAll()
})
```

**b) Always register `initIdleFetch`** — remove the `if (navigator.onLine)` guard. Move the online check inside the callback so the loop is always active but skips silently when offline:

```
initIdleFetch(async () => {
  if (!navigator?.onLine) return   // skip when offline
  await noteStore.fetchAll()
  await rssStore.fetchAll()
})
```

---

### 4.4 `stores/RssStore.ts` — Silent Failure

Apply the same defensive pattern NoteStore already uses:

| Method | Fix |
|--------|-----|
| `fetchAll()` | Wrap body in try/catch; return early if catch |
| `add()` | Already has some guards; wrap Supabase call in try/catch |
| `remove()` | Add `if (!navigator?.onLine) return` before Supabase delete |
| `update()` | Add `if (!navigator?.onLine) return` before Supabase update |
| `fetchRssFromNetlifyFunction()` | Wrap in try/catch, return `null` on failure |

`addFeedsToNotes()` calls `noteStore.add()` which is already safe.

---

### 4.5 `stores/WeatherStore.ts` — Verify Try/Catch

Audit the weather fetch call. Wrap in try/catch if missing. LocationStore already has this — WeatherStore must match.

---

### 4.6 Auth Redirect Suppression While Offline

**Problem:** `@nuxtjs/supabase` registers a Nuxt middleware that redirects to `/` whenever `useSupabaseUser()` is null. When offline and the JWT expires, the Supabase client emits `SIGNED_OUT`, the middleware catches it, and the user is kicked to the login page — losing their offline session.

**Fix:** Add a Nuxt route middleware (`middleware/offline-auth.global.ts`) that intercepts navigation to `/` while offline:

```
If:
  - target route is '/' (login page)
  AND navigator is offline
  AND localStorage has notes for a known user ID
Then:
  → abort the navigation (user stays on current page)
```

The "known user ID" can be derived from the localStorage key `notes-${userId}` — if any such key exists with content, a user was previously authenticated.

Implementation note: this middleware must run **after** the supabase middleware. Nuxt runs global middlewares in filename order; name it `z-offline-auth.global.ts` or rely on alphabetical ordering after `supabase`.

---

### 4.7 `utils/idleFetch.ts` — No Changes

The idle fetch utility itself is correct. The fix is in `app.vue` (section 4.3).

---

## 5. Files Changed

| File | Type | Change |
|------|------|--------|
| `nuxt.config.ts` | Edit | Add `navigateFallback: '/'` to workbox |
| `app.vue` | Edit | Add `online` event listener; remove `onLine` guard on `initIdleFetch` |
| `stores/NoteStore.ts` | Edit | Add `syncLocalToServer()` function; export it |
| `stores/RssStore.ts` | Edit | Add try/catch + `navigator.onLine` guards to all methods |
| `stores/WeatherStore.ts` | Edit | Verify/add try/catch around fetch |
| `middleware/offline-auth.global.ts` | Create | Suppress auth redirect to `/` when offline |

---

## 6. Out of Scope

- Offline indicator / banner UI
- Offline deletions (accepted limitation — note reappears on reconnect)
- IndexedDB or background sync API
- Conflict UI for multi-device edit collisions
- RSS feed offline availability
