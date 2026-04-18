# Offline Functionality — Brainstorming

---

## Round 1 — Scope & Core Strategy

### Q1: What should happen when the user opens the app while already offline?

- [x] A) Show the full app normally using cached/local data (notes load from localStorage, no indication of offline state)
- [ ] B) Show the full app with a persistent banner/indicator that the user is offline **[recommended]**
- [ ] C) Show a dedicated "You're offline" splash screen that blocks the app until reconnected

---

### Q2: Which data needs to be available offline?

The app currently has: notes, RSS feeds, weather, location.

- [x] A) Notes only — RSS/weather/location are nice-to-have and can fail silently **[recommended]**
- [ ] B) Notes + RSS feed list (not live data, just the saved feeds the user added)
- [ ] C) Everything — full offline parity including weather/location from cache

---

### Q3: What is the conflict resolution strategy when offline edits collide with server state on reconnect?

Scenario: user edits note A offline → reconnects → server has a newer version of note A (edited from another device).

- [x] A) Last-write-wins based on `edited_at` timestamp — whichever is newer survives **[recommended]**
- [ ] B) Local always wins — offline changes always override the server
- [ ] C) Server always wins — discard offline changes on reconnect
- [ ] D) Show a conflict UI — let the user choose which version to keep

---

### Q4: How should pending offline writes be stored?

When the user edits/creates/deletes a note while offline, where is that queued?

- [x] A) Nothing extra needed — the note data already lives in `localStorage`; on reconnect, push all local notes that are newer than server versions **[recommended]**
- [ ] B) A separate `pending-queue` in `localStorage` — an ordered log of `{operation, noteId, data, timestamp}` entries that are replayed in order on reconnect
- [ ] C) IndexedDB — more robust than localStorage for larger queues

---

## Round 2 — Sync Algorithm & Edge Cases

### Q5: Offline deletions — a tricky edge case

With Q4-A (no separate queue), deleting a note offline removes it from `localStorage`. On reconnect, `fetchAll()` pulls the server data and the note comes back — the deletion is silently lost.

Options:

- [x] A) Accept this limitation — offline deletions are not supported; if you delete while offline the note reappears when reconnected **[recommended for simplicity]**
- [ ] B) Track deletions with a small `deleted-notes-${userId}` set in localStorage (just IDs + timestamps); on reconnect, delete those IDs from server before fetching
- [ ] C) Use the "Trash" tag as a soft-delete buffer — moving to trash works offline; permanent deletion requires being online

---

### Q6: What triggers the sync when the user comes back online?

- [x] A) `window` `online` event — fires automatically when browser detects reconnection, immediately starts sync **[recommended]**
- [ ] B) Manual — add a "Sync now" button the user has to tap
- [ ] C) Both — auto-sync on `online` event + a manual refresh button as fallback

---

### Q7: What does the user see during the reconnect sync?

Currently there is a `SyncStore` with an `isSyncing` spinner in the bottom-left corner (desktop only).

- [x] A) Reuse the existing spinner — no extra feedback needed **[recommended]**
- [ ] B) Show a short snackbar toast: "Back online — syncing…" then "Synced ✓"
- [ ] C) Both spinner + snackbar

---

### Q8: Navigation while offline — service worker gap

Currently the PWA has no `navigateFallback`. If the user is offline and navigates to `/note/abc` (e.g. taps a link), the service worker has no cached response for that URL and the browser shows a network error page — breaking routing entirely.

Fix: add `navigateFallback: '/'` to the Workbox config so the SW always serves the SPA shell for any navigation request, letting Vue Router take over.

- [x] A) Yes — add `navigateFallback: '/'` so all offline navigation works **[recommended]**
- [ ] B) No — keep current behavior; offline navigation to new URLs is acceptable to fail

---

### Q9: What replaces the Nuxt error crash screen?

Currently any unhandled error (e.g. Supabase throws while offline) shows Nuxt's generic error page with a stack trace. A custom `error.vue` can intercept this.

- [ ] A) Add a simple `error.vue` that shows "Something went wrong" with a Reload button — no offline-specific messaging **[recommended]**
- [ ] B) Add a smart `error.vue` that detects if the error was network-related (offline) and shows a specific "You appear to be offline" message
- [x] C) Don't add `error.vue` — fix the root causes so errors never reach the crash screen

---

## Round 3 — Reconnect Flow, Auth & Remaining Gaps

### Q10: Confirm the reconnect sync algorithm

When the `online` event fires, the proposed algorithm is:

```
1. Push local-only notes to server
   → For each note in localStorage NOT found on server by ID → upsert to Supabase

2. Push locally-newer notes to server
   → For each note in localStorage that IS on server, but local edited_at > server edited_at → upsert to Supabase

3. Fetch fresh server state
   → Run fetchAll() which overwrites localStorage with the merged server truth
```

Visually:

```
localStorage notes ─────────────────────────────────────────┐
                    ↓ compare by ID + edited_at              │
server notes    ────┘                                        │
                    ↓ push winners to Supabase               │
                    ↓ fetchAll() → localStorage ←────────────┘
```

- [x] A) Yes — this algorithm is correct **[recommended]**
- [ ] B) Skip step 3 (fetchAll after push) — trust local state after pushing, avoid extra round-trip
- [ ] C) Reverse order — fetch server first, then push local notes that are newer than what came back

---

### Q11: Auth session while offline

Supabase uses short-lived JWTs (~1 hour). If the user goes offline and the token expires, `@nuxtjs/supabase` may redirect them to the login page (`/`) — breaking the offline experience even though notes are in localStorage.

- [x] A) Handle it — detect expired-token redirects while offline and suppress them, keeping the user on their current page **[recommended]**
- [ ] B) Accept it — if the token expires offline the user sees the login page; they can log back in when online
- [ ] C) Investigate first — check if `@nuxtjs/supabase` actually triggers this and only fix if it does

---

### Q12: What does "fix root causes" mean for RssStore and WeatherStore?

Q9-C means no crash screen safety net — every store must never throw an unhandled error. The current gaps are:

| Store                 | Problem                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| `RssStore.fetchAll()` | No try/catch, no `navigator.onLine` guard — throws when offline               |
| `RssStore.remove()`   | No online guard — deletes from UI then fails to delete from server            |
| `RssStore.update()`   | No online guard                                                               |
| `WeatherStore`        | External API call — can throw on timeout                                      |
| `app.vue`             | `await rssStore.fetchAll()` is top-level — any throw here could crash the app |

Proposed fix: wrap every Supabase/network call in try/catch + skip DB operations when offline (same pattern NoteStore already uses).

- [x] A) Yes — apply consistent try/catch + `navigator.onLine` guards across all stores **[recommended]**
- [ ] B) Only fix RssStore — WeatherStore/LocationStore already have try/catch and are low priority
- [ ] C) Also add a global Vue error handler (`app.config.errorHandler`) as a last-resort safety net in addition to per-store fixes

---

### Q13: `initIdleFetch` when the app starts offline

Currently `app.vue` only calls `initIdleFetch(...)` if `navigator.onLine` is true at boot. If the app starts offline, the idle-fetch loop is never set up — even after the user reconnects, notes won't auto-refresh in the background.

- [x] A) Always call `initIdleFetch` — move the online check inside the callback so it skips when offline but the loop is always registered **[recommended]**
- [ ] B) Also re-init `initIdleFetch` when the `online` event fires, in case app started offline
- [ ] C) Keep current behavior — idle fetch is a nice-to-have and the `online` event sync is enough

---
