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
const rule = require('../../../lib/rules/require-v-for-key')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('require-v-for-key', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-bind:key="x"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" :key="x.foo"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom-component v-for="x in list"></custom-component></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"></div></div></template>',
      errors: ["'v-for' directives require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" key="100"></div></div></template>',
      errors: ["'v-for' directives require 'v-bind:key' directives."]
    }
  ]
})
