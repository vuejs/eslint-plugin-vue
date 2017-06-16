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
const rule = require('../../../lib/rules/no-confusing-v-for-v-if')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-confusing-v-for-v-if', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="x"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="x.foo"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(x,i) in list" v-if="i%2==0"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="shown"><div v-for="(x,i) in list"></div></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="shown"></div></div></template>',
      errors: ["This 'v-if' should be moved to the wrapper element."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="list.length&gt;0"></div></div></template>',
      errors: ["This 'v-if' should be moved to the wrapper element."]
    }
  ]
})
