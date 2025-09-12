import { createConfigForNuxt } from '@nuxt/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default createConfigForNuxt({
  // Enable Nuxt's built-in TypeScript support
  features: {
    typescript: true,
    stylistic: false
  }
})
  .append({
    rules: {
      // Preserve the custom rule from the old config
      'no-console': 'off'
    }
  })
  // Add Prettier config to disable conflicting rules
  .append(eslintConfigPrettier)
