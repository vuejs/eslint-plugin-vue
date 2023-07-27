/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-macro-variable-name')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

const customOptions = {
  defineProps: 'customProps',
  defineEmits: 'customEmits',
  defineSlots: 'customSlots',
  useSlots: 'customUseSlots',
  useAttrs: 'customUseAttrs'
}

tester.run('require-macro-variable-name', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const props = defineProps({})
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo, bar } = defineProps(['foo', 'bar'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = 42, bar = 'abc' } = defineProps(['foo', 'bar'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        import { toRef } from 'vue'

        const props = defineProps(['foo', 'bar'])
        const foo = toRef(props, 'foo')
        const bar = toRef(props, 'bar')
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const props = withDefaults(defineProps(['foo', 'bar']), {
          foo: 42,
          bar: 'abc'
        })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const ${customOptions.defineProps} = defineProps(['foo', 'bar'])
        const ${customOptions.defineEmits} = defineEmits(['baz'])
      </script>
      `,
      options: [customOptions]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const customName = defineProps({})
      </script>
      `,
      errors: [
        {
          message: 'The variable name of "defineProps" must be "props".',
          line: 3,
          column: 15,
          suggestions: [
            {
              desc: 'Change the variable name to "props".',
              output: `
      <script setup>
        const props = defineProps({})
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const emitsWrong = defineEmits({})
        const slotsWrong = defineSlots({})
        const attrsWrong = useAttrs({})
      </script>
      `,
      errors: [
        {
          message: 'The variable name of "defineEmits" must be "emit".',
          line: 3,
          column: 15,
          suggestions: [
            {
              desc: 'Change the variable name to "emit".',
              output: `
      <script setup>
        const emit = defineEmits({})
        const slotsWrong = defineSlots({})
        const attrsWrong = useAttrs({})
      </script>
      `
            }
          ]
        },
        {
          message: 'The variable name of "defineSlots" must be "slots".',
          line: 4,
          column: 15,
          suggestions: [
            {
              desc: 'Change the variable name to "slots".',
              output: `
      <script setup>
        const emitsWrong = defineEmits({})
        const slots = defineSlots({})
        const attrsWrong = useAttrs({})
      </script>
      `
            }
          ]
        },
        {
          message: 'The variable name of "useAttrs" must be "attrs".',
          line: 5,
          column: 15,
          suggestions: [
            {
              desc: 'Change the variable name to "attrs".',
              output: `
      <script setup>
        const emitsWrong = defineEmits({})
        const slotsWrong = defineSlots({})
        const attrs = useAttrs({})
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const slotsWrong = useSlots({})
      </script>
      `,
      errors: [
        {
          message: 'The variable name of "useSlots" must be "slots".',
          line: 3,
          column: 15,
          suggestions: [
            {
              desc: 'Change the variable name to "slots".',
              output: `
      <script setup>
        const slots = useSlots({})
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const propsWrong = withDefaults(defineProps(['foo', 'bar']), {
          foo: 42,
          bar: 'abc'
        })
      </script>
      `,
      errors: [
        {
          message: 'The variable name of "defineProps" must be "props".',
          line: 3,
          column: 15,
          suggestions: [
            {
              desc: 'Change the variable name to "props".',
              output: `
      <script setup>
        const props = withDefaults(defineProps(['foo', 'bar']), {
          foo: 42,
          bar: 'abc'
        })
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const slots = defineSlots({})
        const useSlots = useSlots({})
        const attrs = useAttrs({})
      </script>
      `,
      options: [customOptions],
      errors: [
        {
          message: `The variable name of "defineSlots" must be "${customOptions.defineSlots}".`,
          line: 3,
          column: 15,
          suggestions: [
            {
              desc: `Change the variable name to "${customOptions.defineSlots}".`,
              output: `
      <script setup>
        const ${customOptions.defineSlots} = defineSlots({})
        const useSlots = useSlots({})
        const attrs = useAttrs({})
      </script>
      `
            }
          ]
        },
        {
          message: `The variable name of "useSlots" must be "${customOptions.useSlots}".`,
          line: 4,
          column: 15,
          suggestions: [
            {
              desc: `Change the variable name to "${customOptions.useSlots}".`,
              output: `
      <script setup>
        const slots = defineSlots({})
        const ${customOptions.useSlots} = useSlots({})
        const attrs = useAttrs({})
      </script>
      `
            }
          ]
        },
        {
          message: `The variable name of "useAttrs" must be "${customOptions.useAttrs}".`,
          line: 5,
          column: 15,
          suggestions: [
            {
              desc: `Change the variable name to "${customOptions.useAttrs}".`,
              output: `
      <script setup>
        const slots = defineSlots({})
        const useSlots = useSlots({})
        const ${customOptions.useAttrs} = useAttrs({})
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const slotsCustom = defineSlots({})
        const attrsCustom = useAttrs({})
      </script>
      `,
      options: [{ defineSlots: 'slotsCustom' }],
      errors: [
        {
          message: `The variable name of "useAttrs" must be "attrs".`,
          line: 4,
          column: 15,
          suggestions: [
            {
              desc: `Change the variable name to "attrs".`,
              output: `
      <script setup>
        const slotsCustom = defineSlots({})
        const attrs = useAttrs({})
      </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
