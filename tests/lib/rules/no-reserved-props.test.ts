/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-reserved-props'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-reserved-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          foo: String
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: ['foo']
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({ foo: String })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: String
      }
      defineProps<Props>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            ref: ''
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        is: string,
        slot: string,
        "slot-scope": string,
      }
      defineProps<Props>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          ref: String,
          key: String,
          is: String,
          slot: String,
          "slot-scope": String,
        }
      }
      </script>
      `,
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 22
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          ref: String,
          key: String,
          is: String,
          slot: String,
          "slot-scope": String,
        }
      }
      </script>
      `,
      options: [{ vueVersion: 3 }],
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 22
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [
          'ref',
          'key',
          'is',
          'slot',
          "slot-scope",
          "slotScope",
          'class',
          \`style\`
        ]
      }
      </script>
      `,
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 16
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        ref: String,
        key: String,
        is: String,
        slot: String,
        "slot-scope": String,
      })
      </script>
      `,
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 20
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps([
        'ref',
        'key',
        'is',
        'slot',
        "slot-scope",
      ])
      </script>
      `,
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 14
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        ref: string,
        key: string,
        is: string,
        slot: string,
        "slot-scope": string,
      }
      defineProps<Props>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 21
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          ref: String,
          key: String,
          is: String,
          slot: String,
          "slot-scope": String,
        }
      }
      </script>
      `,
      options: [{ vueVersion: 2 }],
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 22
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 22
        },
        {
          message: "'is' is a reserved attribute and cannot be used as props.",
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 21
        },
        {
          message:
            "'slot' is a reserved attribute and cannot be used as props.",
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 23
        },
        {
          message:
            "'slot-scope' is a reserved attribute and cannot be used as props.",
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [
          'ref',
          'key',
          'is',
          'slot',
          "slot-scope",
        ]
      }
      </script>
      `,
      options: [{ vueVersion: 2 }],
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 16
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 16
        },
        {
          message: "'is' is a reserved attribute and cannot be used as props.",
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 15
        },
        {
          message:
            "'slot' is a reserved attribute and cannot be used as props.",
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 17
        },
        {
          message:
            "'slot-scope' is a reserved attribute and cannot be used as props.",
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [
          "slotScope",
          'class',
          \`style\`
        ]
      }
      </script>
      `,
      options: [{ vueVersion: 2 }],
      errors: [
        {
          message:
            "'slot-scope' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 22
        },
        {
          message:
            "'class' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 18
        },
        {
          message:
            "'style' is a reserved attribute and cannot be used as props.",
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 18
        }
      ]
    }
  ]
})
