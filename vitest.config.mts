import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@eslint-community/eslint-utils': path.resolve(
        __dirname,
        'node_modules/@eslint-community/eslint-utils/index.js'
      )
    }
  },
  test: {
    include: ['tests/lib/**/*.test.ts', 'tests/integrations/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/fixtures/**'],
    testTimeout: 60_000,
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.{js,ts}'],
      exclude: ['tests/**', 'dist/**', 'tools/**', 'node_modules/**'],
      reporter: ['text', 'lcov', 'json-summary', 'html'],
      reportsDirectory: './coverage'
    }
  }
})
