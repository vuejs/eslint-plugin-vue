/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-bind')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
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
      code: "<template><input v-bind='$attrs' /></template>"
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
      code: '<template><div v-bind:aaa></div></template>',
      errors: ["'v-bind' directives require an attribute value."]
    },
    {
      filename: 'test.vue',
      code: "<template><div :aaa.unknown='bbb'></div></template>",
      errors: ["'v-bind' directives don't support the modifier 'unknown'."]
    }
  ]
})
