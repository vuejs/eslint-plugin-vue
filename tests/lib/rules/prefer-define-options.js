/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/prefer-define-options')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-define-options', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({ name: 'Foo' })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default { name: 'Foo' }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default { name: 'Foo' }
      </script>
      <script setup>
      const props = defineProps(['foo'])
      </script>
      `,
      output: `
      <script setup>
defineOptions({ name: 'Foo' })

      const props = defineProps(['foo'])
      </script>
      `,
      errors: [
        {
          message: 'Use `defineOptions` instead of default export.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default { name: 'Foo' }
      </script>
      <script setup>
      defineOptions({})
      </script>
      `,
      output: null,
      errors: [
        {
          message: 'Use `defineOptions` instead of default export.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export const A = 42
      export default { name: 'Foo' }
      </script>
      <script setup>
      const props = defineProps(['foo'])
      </script>
      `,
      output: `
      <script>
      export const A = 42
      </script>
      <script setup>
defineOptions({ name: 'Foo' })

      const props = defineProps(['foo'])
      </script>
      `,
      errors: [
        {
          message: 'Use `defineOptions` instead of default export.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const props = defineProps(['foo'])
      </script>
      <script>
      export default { name: 'Foo' }
      </script>
      `,
      output: `
      <script setup>
      import { ref } from 'vue'
defineOptions({ name: 'Foo' })

      const props = defineProps(['foo'])
      </script>
      `,
      errors: [
        {
          message: 'Use `defineOptions` instead of default export.',
          line: 7
        }
      ]
    }
  ]
})
