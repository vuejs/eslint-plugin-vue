/**
 * @author *****CZB*****
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
      <script setup>
      const props = defineProps({
        /*
         * a comment
         */
        a: Number,
        /**
         * b comment
         */
        b: Number
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
        }
      })
      `,
      options: [{ type: 'unlimited' }]
    }
  ],
  invalid: [
    {
      code: `
      <script>
      import { defineComponent } from '@vue/composition-api'

      export default defineComponent({
        props: {
          a: Number,
          // c comment
          c: Number
        }
      })
      </script>
      `,
      options: [{ type: 'block' }],
      errors: [
        {
          line: 7,
          message: 'The "a" property should have a block comment.'
        },
        {
          line: 9,
          message: 'The "c" property should have a block comment.'
        }
      ]
    },
    {
      code: `
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
          line: 10,
          message: 'The "a" property should have a line comment.'
        },
        {
          line: 11,
          message: 'The "b" property should have a line comment.'
        }
      ]
    },
    {
      code: `
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
          line: 4,
          message: `The "a" property should have a comment.`
        }
      ]
    },
    {
      code: `
      <script setup>
      const props = defineProps([
        'a'
      ])
      </script>
      `,
      errors: [
        {
          line: 4,
          message: 'The "a" property should have a JSDoc comment.'
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
          message: 'The "a" property should have a JSDoc comment.'
        }
      ]
    }
  ]
})
