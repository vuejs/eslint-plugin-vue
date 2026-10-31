import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['lib/index.ts', 'lib/configs/**/*.ts', 'lib/removed-rules.ts'],
  format: ['cjs'],
  copy: ['lib/index.d.ts', 'lib/eslint-typegen.d.ts'],
  dts: false,
  deps: {
    neverBundle: ['typescript']
  },
  unbundle: true,
  fixedExtension: false
})
