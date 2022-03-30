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
      <script> export default { components: { ValidImport } } </script>
      `,
      options: [{ casing: 'camel' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'valid-import': ValidImport } } </script>
      `,
      options: [{ casing: 'kebab-case' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { ValidImport, ...SpreadImport } } </script>
      `,
      options: [{ casing: 'camel' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'valid-import': ValidImport, ...SpreadImport } } </script>
      `,
      options: [{ casing: 'kebab-case' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { PrefixValidImport: ValidImport } } </script>
      `,
      options: [{ casing: 'camel', prefix: 'Prefix' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'prefix-valid-import': ValidImport } } </script>
      `,
      options: [{ casing: 'kebab-case', prefix: 'prefix-' }]
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
      <script> export default { name: "test" } </script>
      `
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
          message: 'component alias InvalidExport should match SomeRandomName',
          line: 2,
          column: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { 'invalid-export': InvalidExport } } </script>
      `,
      errors: [
        {
          message: 'component alias invalid-export should match InvalidExport',
          line: 2,
          column: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { InvalidImport } } </script>
      `,
      options: [{ casing: 'kebab-case' }],
      errors: [
        {
          message: 'component alias InvalidImport should match invalid-import',
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
      options: [{ casing: 'kebab-case', prefix: 'prefix-' }],
      errors: [
        {
          message:
            'component alias invalid-import should have the prefix prefix-',
          line: 2,
          column: 47
        },
        {
          message:
            'component alias invalid-import should match prefix-invalid-import',
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
      options: [{ casing: 'camel', prefix: 'Prefix' }],
      errors: [
        {
          message:
            'component alias invalid-import should have the prefix Prefix',
          line: 2,
          column: 47
        },
        {
          message:
            'component alias invalid-import should match PrefixInvalidImport',
          line: 2,
          column: 47
        }
      ]
    }
  ]
})
