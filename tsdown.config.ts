import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['cjs'],
  copy: ['lib/index.d.ts', 'lib/eslint-typegen.d.ts', 'lib/removed-rules.js'],
  dts: false,
  external: ['typescript'],
  unbundle: true,
  fixedExtension: false
})
