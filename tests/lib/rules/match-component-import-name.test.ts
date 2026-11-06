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
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { FooBar } from './types'
      import FooBarComponent from './FooBar.vue'
      export default defineComponent({ components: { FooBar: FooBarComponent } })
      </script>
      `,
      options: [{ ignoreConflictingNames: true }],
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      interface FooBar { foo: string }
      import FooBarComponent from './FooBar.vue'
      export default { components: { 'foo-bar': FooBarComponent } }
      </script>
      `,
      options: [{ ignoreConflictingNames: true }],
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { FooBar } from './store'
      import FooBarComponent from './FooBar.vue'
      export default { components: { FooBar: FooBarComponent } }
      </script>
      `,
      options: [{ ignoreConflictingNames: true }]
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
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { FooBar } from './types'
      import FooBarComponent from './FooBar.vue'
      export default defineComponent({ components: { FooBar: FooBarComponent } })
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          message:
            'Component alias FooBar should be one of: FooBarComponent, foo-bar-component.',
          line: 5,
          column: 54,
          endLine: 5,
          endColumn: 77
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import FooBarComponent from './FooBar.vue'
      export default { components: { FooBar: FooBarComponent } }
      </script>
      `,
      options: [{ ignoreConflictingNames: true }],
      errors: [
        {
          message:
            'Component alias FooBar should be one of: FooBarComponent, foo-bar-component.',
          line: 4,
          column: 38,
          endLine: 4,
          endColumn: 61
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import FooBarComponent from './FooBar.vue'
      function setup() { const FooBar = 1; return FooBar }
      export default { setup, components: { FooBar: FooBarComponent } }
      </script>
      `,
      options: [{ ignoreConflictingNames: true }],
      errors: [
        {
          message:
            'Component alias FooBar should be one of: FooBarComponent, foo-bar-component.',
          line: 5,
          column: 45,
          endLine: 5,
          endColumn: 68
        }
      ]
    }
  ]
})
