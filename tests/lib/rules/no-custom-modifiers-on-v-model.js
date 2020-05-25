/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview This rule checks whether v-model used on the component do not have custom modifiers
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-custom-modifiers-on-v-model')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-custom-modifiers-on-v-model', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.trim="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.trim="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.lazy="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.lazy="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.number="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.number="foo"></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.aaa="foo"></template>',
      errors: ["'v-model' directives don't support the modifier 'aaa'."]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.aaa="foo"></template>',
      errors: ["'v-model' directives don't support the modifier 'aaa'."]
    }
  ]
})
