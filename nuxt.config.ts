export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
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
      callback: "/confirm",
    },
  },
  svgo: { defaultImport: "component" },
  css: [
    "~/assets/css/fonts.css",
    "~/assets/css/utils.css",
    "~/assets/css/transitions.css",
  ],
});
