/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/valid-v-show')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('valid-v-show', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="foo"></div></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-show="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-show="/**/" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-show:aaa="foo"></div></template>',
      errors: ["'v-show' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show.aaa="foo"></div></template>',
      errors: ["'v-show' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show></div></template>',
      errors: ["'v-show' directives require that attribute value."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-show=""></div></template>',
      errors: ["'v-show' directives require that attribute value."]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-show="condition"></template></template>',
      errors: ["'v-show' directives cannot be put on <template> tags."]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-show="condition" /></template>',
      errors: ["'v-show' directives cannot be put on <template> tags."]
    }
  ]
})
