module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  extends: [
    "@nuxt/eslint-config",
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": 0,
  },
};
