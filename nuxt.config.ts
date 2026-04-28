import { Filter } from "./types/enums";

export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: "Privy Notes",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          key: "description",
          name: "description",
          content: "Great notes for great people",
        },
        { name: "theme-color", content: "#285799" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/icons/favicon.ico" },
        {
          rel: "apple-touch-icon",
          href: "/icons/apple-touch-icon-180x180.png",
        },
      ],
      bodyAttrs: { class: "bg-neutral-500 dark:bg-neutral-50" },
    },
    pageTransition: { name: "slide", mode: "out-in" },
    layoutTransition: { name: "fade", mode: "out-in" },
  },

  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "nuxt-svgo",
  ],

  typescript: {
    typeCheck: true,
    tsConfig: {
      exclude: ["../tests/**"],
    },
  },

  colorMode: {
    classSuffix: "",
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
  },

  supabase: {
    redirectOptions: {
      login: "/",
      callback: `/notes?filter=${Filter.Favorites}`,
    },
  },

  svgo: { defaultImport: "component" },

  css: [
    "~/assets/css/fonts.css",
    "~/assets/css/utils.css",
    "~/assets/css/transitions.css",
  ],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Privy Notes",
      short_name: "Privy Notes",
      description: "Great notes for great people",
      theme_color: "#285799",
      icons: [
        {
          src: "icons/pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "icons/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "icons/maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: [
        "**/*.{css,html,ico,png,svg}",
        "_nuxt/entry.*.{js,css}",
        "_nuxt/builds/**",
        "manifest.webmanifest",
      ],
      globIgnores: ["_nuxt/*.js"],
      maximumFileSizeToCacheInBytes: 3000000, // 3MB limit
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/[^/]+\.supabase\.co\/(rest|auth)\/v1\//,
          handler: "NetworkFirst",
          options: {
            cacheName: "supabase-api",
            networkTimeoutSeconds: 5,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\/\.netlify\/functions\/rss/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "netlify-rss",
            expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\/\.netlify\/functions\/weather/,
          handler: "NetworkFirst",
          options: {
            cacheName: "netlify-weather",
            networkTimeoutSeconds: 5,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\/_nuxt\/.*\.js$/,
          handler: "CacheFirst",
          options: {
            cacheName: "nuxt-js-chunks",
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },

  compatibilityDate: "2025-01-14",
});
