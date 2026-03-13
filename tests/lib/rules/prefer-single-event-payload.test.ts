/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/prefer-single-event-payload'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-single-event-payload', rule, {
  valid: [
    // No payload
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change')" />
      </template>
      `
    },
    // Single payload value
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change', value)" />
      </template>
      `
    },
    // Single object payload
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change', { a, b })" />
      </template>
      `
    },
    // Options API - no payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change')
          }
        }
      }
      </script>
      `
    },
    // Options API - single payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change', value)
          }
        }
      }
      </script>
      `
    },
    // Options API - single object payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change', { a, b })
          }
        }
      }
      </script>
      `
    },
    // setup() with context - single payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, context) {
          context.emit('change', value)
        }
      }
      </script>
      `
    },
    // setup() with destructured emit - single payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, { emit }) {
          emit('change', value)
        }
      }
      </script>
      `
    },
    // script setup - no payload
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change')
      </script>
      `
    },
    // script setup - single payload
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change', value)
      </script>
      `
    },
    // script setup - single object payload
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change', { a, b })
      </script>
      `
    },
    // defineEmits not assigned to variable - cannot track
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineEmits(['change'])
      </script>
      `
    }
  ],

  invalid: [
    // Template - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change', value1, value2)" />
      </template>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'change' }
        }
      ]
    },
    // Template - three payload args
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('update', a, b, c)" />
      </template>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'update' }
        }
      ]
    },
    // Options API - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change', value1, value2)
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'change' }
        }
      ]
    },
    // Options API optional chaining - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit?.('change', value1, value2)
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'change' }
        }
      ]
    },
    // setup() with context - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, context) {
          context.emit('change', value1, value2)
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'change' }
        }
      ]
    },
    // setup() with destructured emit - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, { emit }) {
          emit('change', value1, value2)
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'change' }
        }
      ]
    },
    // script setup - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change', value1, value2)
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'change' }
        }
      ]
    },
    // script setup - three payloads
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['update'])
      emit('update', a, b, c)
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'update' }
        }
      ]
    },
    // Dynamic event name - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit(eventName, value1, value2)
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'preferSinglePayload',
          data: { name: 'unknown' }
        }
      ]
    }
  ]
})
