export default defineNuxtConfig({
  app: {
    head: {
      title: "Privy Notes",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Great notes for great people",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      bodyAttrs: { class: "bg-neutral-500 dark:bg-neutral-50" },
    },
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
      callback: "/notes",
    },
  },
  svgo: { defaultImport: "component" },
  css: [
    "~/assets/css/fonts.css",
    "~/assets/css/utils.css",
    "~/assets/css/transitions.css",
  ],
});
