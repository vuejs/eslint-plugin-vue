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
      <script> export default { components: { ValidImport: ValidImport } } </script>
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
      <script> export default { components: { 'valid-import': ValidImport, [computedImport]: ComputedImport } } </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script> export default { components: { ValidImport, [differentComputedImport]: ComputedImport } } </script>
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
          message:
            'Component alias InvalidExport should be one of: SomeRandomName, some-random-name.',
          line: 2,
          column: 47
        }
      ]
    }
  ]
})
