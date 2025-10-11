import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'

export default defineConfig([
  {
    files: ['**/*.js'],
    ignores: ['node_modules'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
    plugins: { js },
    extends: ['js/recommended']
  },
])
