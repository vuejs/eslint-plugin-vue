/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-reserved-props')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
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
          column: 11
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11
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
          column: 11
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11
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
          column: 11
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11
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
          column: 9
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 9
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
          column: 9
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 9
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: "'ref' is a reserved attribute and cannot be used as props.",
          line: 4,
          column: 9
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 5,
          column: 9
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
          column: 11
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11
        },
        {
          message: "'is' is a reserved attribute and cannot be used as props.",
          line: 7,
          column: 11
        },
        {
          message:
            "'slot' is a reserved attribute and cannot be used as props.",
          line: 8,
          column: 11
        },
        {
          message:
            "'slot-scope' is a reserved attribute and cannot be used as props.",
          line: 9,
          column: 11
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
          column: 11
        },
        {
          message: "'key' is a reserved attribute and cannot be used as props.",
          line: 6,
          column: 11
        },
        {
          message: "'is' is a reserved attribute and cannot be used as props.",
          line: 7,
          column: 11
        },
        {
          message:
            "'slot' is a reserved attribute and cannot be used as props.",
          line: 8,
          column: 11
        },
        {
          message:
            "'slot-scope' is a reserved attribute and cannot be used as props.",
          line: 9,
          column: 11
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
          line: 5
        },
        {
          message:
            "'class' is a reserved attribute and cannot be used as props.",
          line: 6
        },
        {
          message:
            "'style' is a reserved attribute and cannot be used as props.",
          line: 7
        }
      ]
    }
  ]
})
