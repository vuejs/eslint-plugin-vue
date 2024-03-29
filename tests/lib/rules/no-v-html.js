/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-v-html')

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('no-v-html', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo" v-bind="bar"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-html="foo"></div></template>',
      errors: ["'v-html' directive can lead to XSS attack."]
    },
    {
      filename: 'test.vue',
      code: '<template><ul v-html:aaa="userHTML"></ul></template>',
      errors: ["'v-html' directive can lead to XSS attack."]
    },
    {
      filename: 'test.vue',
      code: '<template><section v-html/></template>',
      errors: ["'v-html' directive can lead to XSS attack."]
    }
  ]
})
