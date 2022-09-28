/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-prop-comment')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-prop-comment', rule, {
  valid: [
    {
      code: `
      <template>
        <div>1</div>
      </template>
      <script>
      import { defineComponent } from '@vue/composition-api'

      export default defineComponent({
        props: {
          /**
           * a comment
           */
          a: Number,
          // b comment
          b: Number,
          // c
          // comment
          c: Number
        }
      })
      </script>
      `
    },
    {
      code: `
      <template>
        <div>1</div>
      </template>
      <script setup>
      const props = defineProps({
        /**
         * a comment
         */
        a: Number
      })
      </script>
      `
    },
    {
      code: `
      import { defineComponent } from '@vue/composition-api'
      export const ComponentName = defineComponent({
        props: {
          /**
           * a comment
           */
          a: Number
        },
        render() {
          return <div>1</div>
        }
      })
      `
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div>1</div>
      </template>
      <script>
      import { defineComponent } from '@vue/composition-api'

      export default defineComponent({
        props: {
          a: Number,
          // b comment
          b: Number,
          // c
          // comment
          c: Number
        }
      })
      </script>
      `,
      errors: [
        {
          line: 10
        }
      ]
    },
    {
      code: `
      <template>
        <div>1</div>
      </template>
      <script>
      import { defineComponent } from '@vue/composition-api'

      export default defineComponent({
        props: {
          /**
           * a comment
           */
          a: Number,
          b: Number,
          // c
          // comment
          c: Number
        },
        setup() {}
      })
      </script>
      `,
      errors: [
        {
          line: 14
        }
      ]
    },
    {
      code: `
      <template>
        <div>1</div>
      </template>
      <script setup>
      const props = defineProps({
        a: Number
      })
      </script>
      `,
      errors: [
        {
          line: 7
        }
      ]
    },
    {
      code: `
      <template>
        <div>1</div>
      </template>
      <script setup>
      const props = defineProps([
        'a'
      ])
      </script>
      `,
      errors: [
        {
          line: 7
        }
      ]
    },
    {
      code: `
      import { defineComponent } from '@vue/composition-api'
      export const ComponentName = defineComponent({
        props: {
          a: Number
        },
        render() {
          return <div>1</div>
        }
      })
      `,
      errors: [
        {
          line: 5
        }
      ]
    },
    {
      code: `
      import Vue from 'vue'
      new Vue({
        props: {
          a: Number
        }
      })
      `,
      errors: [
        {
          line: 5
        }
      ]
    }
  ]
})
