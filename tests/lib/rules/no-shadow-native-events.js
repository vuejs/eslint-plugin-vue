/**
 * @author Jonathan Carle
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-shadow-native-events')

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
      <script lang="ts" setup>
        const emit = defineEmits<{ focus: [] }>();
      </script>`,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          messageId: 'violation'
        }
      ]
    },
    {
      filename: 'test2.vue',
      code: `
      <script setup>
        const emit = defineEmits(['change', 'delete', 'click'])
      </script>`,
      errors: [
        {
          messageId: 'violation'
        },
        {
          messageId: 'violation'
        }
      ]
    },
    {
      filename: 'test3.vue',
      code: `
      <script>
      export default { emits: ['click'] }
      </script>`,
      errors: [
        {
          messageId: 'violation'
        }
      ]
    },
    {
      filename: 'test4.vue',
      code: `
      <script>
      export default {
        setup: (props, { emit }) => {
          emit("click");
        },
      };
      </script>`,
      errors: [
        {
          messageId: 'violation'
        }
      ]
    },
    {
      filename: 'test5.vue',
      code: `
      <script>
      export default {
        created() {
          this.$emit('click')
        }
      }
      </script>`,
      errors: [
        {
          messageId: 'violation'
        }
      ]
    },
    {
      filename: 'test5.vue',
      code: `
      <template>
        <button @click="$emit('click')" />
      </template>
      `,

      errors: [
        {
          messageId: 'violation'
        }
      ]
    }
  ]
})
