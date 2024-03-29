/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/valid-v-if')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('valid-v-if', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo"></div></div></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-if="."></div></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><div v-if="/**/"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo" v-else></div></div></template>',
      errors: [
        "'v-if' and 'v-else' directives can't exist on the same element. You may want 'v-else-if' directives."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if="foo" v-else-if="bar"></div></div></template>',
      errors: [
        "'v-if' and 'v-else-if' directives can't exist on the same element."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if:aaa="foo"></div></div></template>',
      errors: ["'v-if' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if.aaa="foo"></div></div></template>',
      errors: ["'v-if' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-if></div></div></template>',
      errors: ["'v-if' directives require that attribute value."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div><div v-if=""></div></div></template>',
      errors: ["'v-if' directives require that attribute value."]
    }
  ]
})
