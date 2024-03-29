/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/valid-v-bind')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('valid-v-bind', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:aaa="bbb"></div></template>'
    },
    {
      filename: 'test.vue',
      code: "<template><div v-bind:aaa='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:aaa=bbb></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind="bbb"></div></template>'
    },
    {
      filename: 'test.vue',
      code: "<template><div v-bind:aaa.prop='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><div v-bind:aaa.camel='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: '<template><div :aaa="bbb"></div></template>'
    },
    {
      filename: 'test.vue',
      code: "<template><div :aaa='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: '<template><div :aaa=bbb></div></template>'
    },
    {
      filename: 'test.vue',
      code: "<template><div :aaa.prop='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><div :aaa.camel='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><div :aaa.attr='bbb'></div></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-bind='$attrs' /></template>"
    },
    // v-bind same-name shorthand (Vue 3.4+)
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent :foo="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent :foo="/**/" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-bind></div></template>',
      errors: ["'v-bind' directives require an attribute value."]
    },
    {
      filename: 'test.vue',
      code: "<template><div :aaa.unknown='bbb'></div></template>",
      errors: ["'v-bind' directives don't support the modifier 'unknown'."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent :foo="" /></template>',
      errors: ["'v-bind' directives require an attribute value."]
    }
  ]
})
