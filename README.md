# Privy Notes 2

I love making notes. That's why I've build a PWA for structuring thoughts, daily tasks and everything that keeps you busy. Privy Notes is a feature-rich productivity web app build with Nuxt.js and Supabase.

## Features

- notes (consists of note items that can be either markdown or tasks)
- sorting of note items via drag and drop
- organizing notes in categories
- dark/light mode
- weather based on user location
- undo via snackbar
- RSS Feed integration
- PWA offline features (unfortunately supbase doesn't offer an offline sync out of the box)

## Tech Stack

This is a rewrite of https://github.com/jlnschfr/privy where I used Nuxt2 (w/ options API in an untyped environment). I also switched from Firebase to the open source alternative Supabase.

This project uses Nuxt for static asset generation and Netlify for deployment, bypassing Nuxt's server features. For server-side tasks, it utilize Netlify Functions.

- Nuxt (w/ composition API) + Typescript
- Tailwind
- Supabase
- Pinia
- Netlify
- Netlify Functions

## Supabase Configuration

- Create a project on [Supabase](https://supabase.com).
- In your Supabase project, make sure to create the `notes` table with fields defined in `types/notes.d.ts`.
- Enable RLS for this table with proper policies.
- Create a GitHub Oauth Application on https://github.com/settings/applications/new with homepage url being http://localhost:3000 (needs to be replaced with the site url)
- For the callback url, please refer to https://supabase.com/docs/guides/auth/auth-github#find-your-callback-url
- Enable the GitHub Oauth Provider in your Supabase project (Authentication -> Providers):
- Add the needed site url (and redirect urls) in your Supabase project (Authentication -> URL Configuration):

## Build Setup

```
# install dependencies
$ npm install

# clone `.env.example` to `.env` and add your supabase credentials

# start the development server on http://localhost:3000
$ npm run dev

# in case you need netlify functions running locally (e.g. for fetching Rss feeds)
# instead start the development server on http://localhost:8888
$ npm install netlify-cli -g
$ npm run ntl

# generate static project
$ npm run generate
```

See `package.json` for more scripts (e.g. linting, formatting)

## Deployment

Find here a deployed version: [Privy2 on Netlify](https://privy-notes2.netlify.app)
