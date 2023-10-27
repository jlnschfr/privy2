export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
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
  css: ["~/assets/css/fonts.css"],
});
