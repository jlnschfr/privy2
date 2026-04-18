# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run ntl          # dev server with Netlify Functions at http://localhost:8888 (needed for RSS)
npm run build        # production build
npm run generate     # static site generation
npm run type-check   # TypeScript check (vue-tsc)
npm run lint:js      # ESLint (auto-fixes)
npm run lint:css     # Stylelint
npm run format       # Prettier
```

There are no tests in this project.

## Environment

Copy `.env.example` to `.env` and fill in:
- `SUPABASE_URL` — project URL
- `SUPABASE_KEY` — anon key (client-side)
- `SUPABASE_SERVICE_KEY` — service key (Netlify Functions only)

## Architecture

**Nuxt 4 SPA** (`ssr: false`) deployed as static assets on Netlify. No server-side rendering. Server-side work is handled exclusively by Netlify Functions in `netlify/functions/`.

### Data layer

Two Supabase tables: `notes` and `rss`. Types are generated in `types/database.types.ts` — do not edit manually. All DB access goes through typed Pinia stores using `useSupabaseClient<Database>()`.

Auth is GitHub OAuth via `@nuxtjs/supabase`. Redirect config in `nuxt.config.ts` (`supabase.redirectOptions`): unauthenticated users land on `/`, authenticated users go to `/notes`.

### Pinia stores

Each store follows the same pattern: update local state immediately, then sync to Supabase only if `navigator.onLine`. This is the offline strategy for `NoteStore`.

| Store | Persistence | Purpose |
|-------|------------|---------|
| `NoteStore` | `localStorage` (per user ID) | Core note CRUD + offline sync |
| `RssStore` | in-memory | RSS feed management; creates notes from feed items |
| `TagStore` | derived | Computed from `NoteStore` — no DB |
| `LocationStore` | `localStorage` | Reverse-geocode user location, 30 min cache |
| `WeatherStore` | in-memory | Current weather via WeatherAPI, keyed to location |
| `SyncStore` | in-memory | `isSyncing` boolean for the spinner in `layouts/default.vue` |
| `SnackbarStore` | in-memory | Toast notifications with optional undo callback |

### Note structure

A note has a `title` and an `items` array. Each item is either a `Markdown` or a `Task` (see `types/`). Items are rendered and reordered via `PrivyDraggableItems`. Tags are free-form strings stored as `{ text: string }[]`; the special tags `"Trash"` and `"RSS"` drive filtering logic in `NoteStore`.

### Initialization flow

`app.vue` is the entry point. On user login it calls `locationStore.init()` → `weatherStore.init()` → `noteStore.fetchAll()` → `rssStore.fetchAll()`. It also sets up `initIdleFetch` (from `utils/idleFetch.ts`) which re-fetches notes every 40 s when the browser is idle.

### Netlify Functions

- `netlify/functions/rss` — fetches and parses RSS feeds server-side (avoids CORS). Called via `$fetch('/.netlify/functions/rss', { query: { url } })`.
- `netlify/functions/delete` — server-side deletion using the service key.

Use `npm run ntl` (not `npm run dev`) when working on anything that calls these functions locally.

### PWA

Configured via `@vite-pwa/nuxt` with Workbox. Static assets are pre-cached. The service worker is generated at build time — do not create a manual `sw.js`. PWA icons are in `public/icons/`; regenerate with `npm run generate-pwa-assets` if the logo changes.

### Component naming

Prefix with `Privy` for page-level/feature components (`PrivyNoteDetail`, `PrivyDrawer`). Use `_` prefix for generic UI primitives (`_Button`, `_Spinner`, `_Markdown`). Nuxt auto-imports all components — no manual imports needed.
