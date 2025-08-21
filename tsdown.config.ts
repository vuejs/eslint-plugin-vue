import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['lib/index.js'],
  format: ['cjs'],
  copy: ['lib/index.d.ts'],
  dts: false,
  unbundle: true
})
