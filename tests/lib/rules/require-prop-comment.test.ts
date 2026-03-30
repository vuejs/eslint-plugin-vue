/**
 * @author CZB
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/require-prop-comment'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
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
          message: `The "b" property should have a JSDoc comment.`,
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 20
        },
        {
          message: `The "c" property should have a JSDoc comment.`,
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 20
        },
        {
          message: `The "d" property should have a JSDoc comment.`,
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 20
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
          message: 'The "b" property should have a block comment.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 18
        },
        {
          message: 'The "c" property should have a block comment.',
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 18
        },
        {
          message: 'The "d" property should have a block comment.',
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 18
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
          message: 'The "b" property should have a line comment.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 18
        },
        {
          message: 'The "c" property should have a line comment.',
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 18
        },
        {
          message: 'The "d" property should have a line comment.',
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 18
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
          message: `The "d" property should have a comment.`,
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 18
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
          message: 'The "a" property should have a JSDoc comment.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 20
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
          message: 'The "a" property should have a JSDoc comment.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 20
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
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'The "a" property should have a JSDoc comment.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 18
        }
      ]
    }
  ]
})
