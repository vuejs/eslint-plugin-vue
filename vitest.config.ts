
import { configDefaults, defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: [...configDefaults.include, 'tests/lib/**/*.js', 'tests/integrations/**/*.js'],
    exclude: [...configDefaults.exclude, 'tests/fixtures/**'],
    passWithNoTests: true,
    testTimeout: 60_000,
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.js'],
      exclude: [
        'tests/**',
        'dist/**',
        'tools/**',
        'node_modules/**'
      ],
      reporter: ['text', 'lcov', 'json-summary', 'html'],
      all: true,
      reportsDirectory: './coverage'
    },
  },
});
