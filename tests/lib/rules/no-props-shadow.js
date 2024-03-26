/**
 * @author XWBX
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-props-shadow')

const tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      parser: require.resolve('@typescript-eslint/parser')
    },
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-props-shadow', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script lang="ts" setup>
      import { ref } from 'vue';
      defineProps<{ foo: { a: string } }>();
      {
        const foo = ref();
      }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'import.vue',
      code: `
      <script lang="ts" setup>
      import foo from 'a'
      defineProps<{ foo: { a: string } }>();
      </script>
      `,
      errors: [
        {
          message: 'This binding will shadow `foo` prop in template.',
          line: 3,
          column: 7
        }
      ]
    },
    {
      filename: 'var.vue',
      code: `
      <script lang="ts" setup>
      import { ref } from 'vue';
      defineProps<{ foo: { a: string } }>();
      const foo = ref();
      </script>
      `,
      errors: [
        {
          message: 'This binding will shadow `foo` prop in template.',
          line: 5,
          column: 7
        }
      ]
    },
    {
      filename: 'func.vue',
      code: `
      <script lang="ts" setup>
      defineProps<{ foo: { a: string } }>();
      function foo(){}
      </script>
      `,
      errors: [
        {
          message: 'This binding will shadow `foo` prop in template.',
          line: 4,
          column: 7
        }
      ]
    }
  ]
})
