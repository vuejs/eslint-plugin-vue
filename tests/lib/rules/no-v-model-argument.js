/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview This rule checks whether v-model used on custom component do not have an argument
 */
'use strict'

const rule = require('../../../lib/rules/no-v-model-argument')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('no-v-model-argument', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="bar"></MyComponent></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:foo="bar"></MyComponent></template>',
      errors: ["'v-model' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:foo.trim="bar"></MyComponent></template>',
      errors: ["'v-model' directives require no argument."]
    }
  ]
})
