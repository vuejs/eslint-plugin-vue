/**
 * @author CZB
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-prop-comment')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-prop-comment', rule, {
  valid: [
    `
      <script setup>
      export default defineComponent({
        props: {
          /** JSDoc comment */
          a: Number,
        }
      })
      </script>
    `,
    {
      code: `
      <script setup>
      const goodProps = defineProps({
        /* block comment */
        a: Number,
      })
      </script>
      `,
      options: [{ type: 'block' }]
    },
    {
      code: `
      <script setup>
      const goodProps = defineProps({
        // line comment
        a: Number,
      })
      </script>
      `,
      options: [{ type: 'line' }]
    },
    {
      code: `
      <script setup>
      const goodProps = defineProps({
        /** JSDoc comment */
        a: Number,

        /* block comment */
        b: Number,

        // line comment
        c: Number,
      })
      </script>
      `,
      options: [{ type: 'any' }]
    },
    `
      <script lang="ts">
      export default defineComponent({
        props: {
          /** JSDoc comment */
          a: Number
        }
      })
      </script>
    `,
    {
      code: `
      <script setup lang="ts">
      type PropType = {
        /** JSDoc comment */
        a: number
      }
      const props = defineProps<PropType>()
      </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Props1 as Props} from './test01'
      defineProps<Props>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    }
  ],
  invalid: [
    {
      code: `
      export default defineComponent({
        props: {
          // line comment
          b: Number,

          /* block comment */
          c: Number,

          d: Number,
        }
      })
      `,
      errors: [
        {
          line: 5,
          column: 11,
          message: `The "b" property should have a JSDoc comment.`
        },
        {
          line: 8,
          column: 11,
          message: `The "c" property should have a JSDoc comment.`
        },
        {
          line: 10,
          column: 11,
          message: `The "d" property should have a JSDoc comment.`
        }
      ]
    },
    {
      code: `
      <script setup>
      const badProps = defineProps({
        /** JSDoc comment */
        b: Number,

        // line comment
        c: Number,

        d: Number,
      })
      </script>
      `,
      options: [{ type: 'block' }],
      errors: [
        {
          line: 5,
          column: 9,
          message: 'The "b" property should have a block comment.'
        },
        {
          line: 8,
          column: 9,
          message: 'The "c" property should have a block comment.'
        },
        {
          line: 10,
          column: 9,
          message: 'The "d" property should have a block comment.'
        }
      ]
    },
    {
      code: `
      <script setup>
      const badProps = defineProps({
        /** JSDoc comment */
        b: Number,

        /* block comment */
        c: Number,

        d: Number,
      })
      </script>
      `,
      options: [{ type: 'line' }],
      errors: [
        {
          line: 5,
          column: 9,
          message: 'The "b" property should have a line comment.'
        },
        {
          line: 8,
          column: 9,
          message: 'The "c" property should have a line comment.'
        },
        {
          line: 10,
          column: 9,
          message: 'The "d" property should have a line comment.'
        }
      ]
    },
    {
      code: `
      <script setup>
      const badProps = defineProps({
        d: Number,
      })
      </script>
      `,
      options: [{ type: 'any' }],
      errors: [
        {
          line: 4,
          column: 9,
          message: `The "d" property should have a comment.`
        }
      ]
    },
    {
      code: `
      <script lang="ts">
      export default defineComponent({
        props: {
          a: Number
        }
      })
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 11,
          message: 'The "a" property should have a JSDoc comment.'
        }
      ]
    },
    {
      code: `
      new Vue({
        props: {
          a: Number
        }
      })
      `,
      errors: [
        {
          line: 4,
          column: 11,
          message: 'The "a" property should have a JSDoc comment.'
        }
      ]
    },
    {
      code: `
      <script setup lang="ts">
      type PropType = {
        a: number
      }
      const props = defineProps<PropType>()
      </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          line: 4,
          column: 9,
          message: 'The "a" property should have a JSDoc comment.'
        }
      ]
    }
  ]
})
