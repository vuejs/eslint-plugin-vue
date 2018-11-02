/**
 * @fileoverview Disable inheritAttrs when using v-bind=&#34;$attrs&#34;
 * @author Hiroki Osame
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-duplicate-attr-inheritence')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-duplicate-attr-inheritence', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: '<template><div><div></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div></div></div></template>
        <script>
        export default { inheritAttrs: true }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div></div></div></template>
        <script>
        const data = {};
        export default {
          ...data,
          inheritAttrs: true
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div></div></div></template>
        <script>
        const inheritAttrs = false;
        export default { inheritAttrs }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind="$attrs"></div></div></template>
        <script>
        export default { inheritAttrs: false }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind="$attrs"></div></div></template>
        <script>
        export default { inheritAttrs: 0 }
        </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-bind="$attrs"></div></div></template>',
      errors: ['Set "inheritAttrs" to false.']
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind="$attrs"></div></div></template>
        <script>
        export default {
          inheritAttrs: true
        }
        </script>
      `,
      errors: ['Set "inheritAttrs" to false.']
    }
  ]
})
