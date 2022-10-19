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
      `,
      options: [{ type: 'block' }]
    },
    {
      code: `
      import { defineComponent } from '@vue/composition-api'
      export const ComponentName = defineComponent({
        props: {
          // a comment
          // a other comment
          a: Number
        },
        render() {
          return <div>1</div>
        }
      })
      `,
      options: [{ type: 'line' }]
    },
    {
      code: `
      import { defineComponent } from '@vue/composition-api'
      export const ComponentName = defineComponent({
        props: {
          /**
           * a comment
           */
          a: Number,
          // a comment
          b: Number
        },
        render() {
          return <div>1</div>
        }
      })
      `,
      options: [{ type: 'unlimited' }]
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
          /**
           * b comment
           */
          /**
           * b other comment
           */
          b: Number,
        }
      })
      </script>
      `,
      errors: [
        {
          line: 10,
          message: 'The "a" property should have one block comment.'
        },
        {
          line: 17,
          message: 'The "b" property should have one block comment.'
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
        },
        setup() {}
      })
      </script>
      `,
      options: [{ type: 'line' }],
      errors: [
        {
          line: 12,
          message: 'The "a" property should have a line comment.'
        },
        {
          line: 13,
          message: 'The "b" property should have a line comment.'
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
        a: Number,
        /**
         * b comment
         */
        b: Number,
        // c comment
        c: Number
      })
      </script>
      `,
      options: [{ type: 'unlimited' }],
      errors: [
        {
          line: 7,
          message: `The "a" property should have a comment.`
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
          line: 7,
          message: 'The "a" property should have one block comment.'
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
          line: 5,
          message: 'The "a" property should have one block comment.'
        }
      ]
    }
  ]
})
