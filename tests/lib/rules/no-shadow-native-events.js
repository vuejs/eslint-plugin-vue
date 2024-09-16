/**
 * @author Jonathan Carle
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-shadow-native-events')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-shadow-native-events', rule, {
  valid: [],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script>
      export default {
      }
      </script>
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'violation',
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: ['click'],
      }
      </script>
      `,
      errors: [
        {
          line: 7,
          column: 17,
          messageId: 'violation',
          endLine: 7,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: {click(){}}
      }
      </script>
      `,
      errors: [
        {
          line: 7,
          column: 17,
          messageId: 'violation',
          endLine: 7,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          onClick() {
            this.$emit('click')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          line: 6,
          column: 24,
          messageId: 'violation',
          endLine: 6,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        methods: {
          onClick() {
            const vm = this
            vm.$emit('click')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          line: 8,
          column: 22,
          messageId: 'violation',
          endLine: 8,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, context) {
          context.emit('click')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 24,
          messageId: 'violation',
          endLine: 5,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, {emit}) {
          emit('click')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 16,
          messageId: 'violation',
          endLine: 5,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, {emit:fire}) {
          fire('click')
          fire('keydown')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 16,
          messageId: 'violation',
          endLine: 5,
          endColumn: 23
        },
        {
          line: 6,
          column: 16,
          messageId: 'violation',
          endLine: 6,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          click () {
            const vm = this
            vm?.$emit?.('click')
            ;(vm?.$emit)?.('keydown')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 7,
          column: 25,
          endLine: 7,
          endColumn: 32
        },
        {
          messageId: 'violation',
          line: 8,
          column: 28,
          endLine: 8,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, c) {
          c?.emit?.('click')
          ;(c?.emit)?.('keydown')
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 28
        },
        {
          messageId: 'violation',
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 33
        }
      ]
    },
    // <script setup>
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup>
      defineEmits(['click'])
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup lang="ts">
      defineEmits<{
        (e: 'click'): void
      }>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup lang="ts">
      defineEmits<(e: 'click') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup>
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 28,
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<(e: 'click') => void>()
      emit('click');
      emit('keydown')
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 32,
          endLine: 3,
          endColumn: 52
        },
        {
          messageId: 'violation',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits([\`click\`])
      emit(\`click\`);
      emit(\`keydown\`)
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 40
        },
        {
          messageId: 'violation',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      // new syntax in Vue 3.3
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{click: []}>()
      emit('foo')
      emit('keydown')
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 42
        },
        {
          messageId: 'violation',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      // new syntax in Vue 3.3
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      type Emits = {click: []}
      const emit = defineEmits<Emits>()
      emit('click')
      emit('keydown')
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 30
        },
        {
          messageId: 'violation',
          line: 6,
          column: 12,
          endLine: 6,
          endColumn: 21
        }
      ]
    },
    {
      code: `
      <script setup lang="ts">
      import {Emits2 as Emits} from './test01'
      const emit = defineEmits<Emits>()
      </script>`,
      errors: [
        {
          messageId: 'violation',
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 37
        },
        {
          messageId: 'violation',
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 37
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="emit('keydown')"/>
      </template>
      <script setup lang="ts">
      const emit = defineEmits<(e: 'click') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 36
        },
        {
          messageId: 'violation',
          line: 6,
          column: 32,
          endLine: 6,
          endColumn: 52
        }
      ]
    }
  ]
})
