import { defineConfig } from 'tsdown'

export default defineConfig({
  target: 'node18',
  entry: ['lib/index.js'],
  format: ['cjs'],
  copy: ['lib/index.d.ts'],
  dts: false,
  external: ['typescriopt'],
  unbundle: true
})
