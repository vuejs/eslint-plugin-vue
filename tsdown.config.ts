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
  fixedExtension: false,
  // Some custom rules use the internal utils directly, e.g.
  // `require('eslint-plugin-vue/dist/utils/index.js').defineTemplateBodyVisitor`.
  // Export the utils object itself (while keeping `.default`) so this works without `.default`.
  // https://github.com/vuejs/eslint-plugin-vue/issues/3005
  outputOptions: {
    footer: ({ fileName }) =>
      fileName === 'utils/index.js'
        ? 'module.exports = Object.assign(exports.default, exports);'
        : ''
  }
})
