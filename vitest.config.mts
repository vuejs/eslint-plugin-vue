import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/lib/**/*.js', 'tests/integrations/**/*.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/fixtures/**',
      'tests/integrations/flat-config/eslint.config.js',
      'tests/lib/rules/no-unsupported-features/utils.js'
    ],
    testTimeout: 60_000,
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.js'],
      exclude: ['tests/**', 'dist/**', 'tools/**', 'node_modules/**'],
      reporter: ['text', 'lcov', 'json-summary', 'html'],
      all: true,
      reportsDirectory: './coverage'
    }
  }
})
