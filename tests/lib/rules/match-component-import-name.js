/**
 * @author Doug Wade
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/match-component-import-name')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('match-component-import-name', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { ValidImport } } </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'valid-import': ValidImport } } </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { ValidImport, ...SpreadImport } } </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'valid-import': ValidImport, ...SpreadImport } } </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { PrefixValidImport: ValidImport } } </script>
      `,
      options: [{ prefix: 'Prefix' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'prefix-valid-import': ValidImport } } </script>
      `,
      options: [{ prefix: 'prefix-' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { InvalidExport: SomeRandomName } } </script>
      `,
      errors: [
        {
          message:
            'Component alias InvalidExport should be one of: SomeRandomName, some-random-name.',
          line: 2,
          column: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'invalid-import': InvalidImport } }
      `,
      options: [{ prefix: 'prefix-' }],
      errors: [
        {
          message:
            'Component alias invalid-import should have the prefix prefix-.',
          line: 2,
          column: 47
        },
        {
          message:
            'Component alias invalid-import should be one of: prefix-InvalidImport, prefix-invalid-import.',
          line: 2,
          column: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'invalid-import': InvalidImport } } </script>
      `,
      options: [{ prefix: 'Prefix' }],
      errors: [
        {
          message:
            'Component alias invalid-import should have the prefix Prefix.',
          line: 2,
          column: 47
        },
        {
          message:
            'Component alias invalid-import should be one of: PrefixInvalidImport, Prefixinvalid-import.',
          line: 2,
          column: 47
        }
      ]
    }
  ]
})
