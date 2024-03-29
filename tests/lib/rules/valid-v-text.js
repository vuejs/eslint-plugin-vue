/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/valid-v-text')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('valid-v-text', rule, {
  valid: [
    {
      filename: 'test.js',
      code: 'test'
    },
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text="foo"></div></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-text="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-text="/**/" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-text:aaa="foo"></div></template>',
      errors: ["'v-text' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text.aaa="foo"></div></template>',
      errors: ["'v-text' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text></div></template>',
      errors: ["'v-text' directives require that attribute value."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-text="" /></template>',
      errors: ["'v-text' directives require that attribute value."]
    }
  ]
})
