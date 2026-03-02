/**
 * @author Doug Wade
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/match-component-import-name'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
          column: 47,
          endLine: 2,
          endColumn: 76
        }
      ]
    }
  ]
})
