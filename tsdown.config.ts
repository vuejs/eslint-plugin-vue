import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['lib/index.ts', 'lib/configs/**/*.ts', 'lib/utils/**/*.ts'],
  format: ['cjs'],
  copy: [
    'lib/index.d.ts',
    'lib/eslint-typegen.d.ts',
    'lib/removed-rules.js',
    { from: 'lib/utils/*.json', to: 'dist/utils/' }
  ],
  dts: false,
  external: ['typescript', /lib\/utils\/.*\.json$/],
  unbundle: true,
  fixedExtension: false
})
