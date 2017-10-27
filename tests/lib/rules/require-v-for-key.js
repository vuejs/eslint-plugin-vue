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
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><div :key="x"></div></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot v-for="x in list" :name="x"></slot></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot v-for="x in list" :name="x"><div :key="x"></div></slot></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"></div></div></template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" key="100"></div></div></template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><div></div></template></div></template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot v-for="x in list" :name="x"><div></div></slot></div></template>',
      errors: ["Elements in iteration expect to have 'v-bind:key' directives."]
    }
  ]
})
