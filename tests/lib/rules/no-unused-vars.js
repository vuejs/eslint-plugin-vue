/**
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 * @copyright 2017 薛定谔的猫. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unused-vars')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-unused-vars', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><ol v-for="i in 5"><li>{{i}}</li></ol></template>'
    },
    {
      filename: 'test.vue',
      code: '<template scope="props">{{props}}</template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><ol v-for="i in 5"></ol></template>',
      errors: ['\'i\' is defined but never used.']
    },
    {
      filename: 'test.vue',
      code: '<template scope="props"></template>',
      errors: ['\'props\' is defined but never used.']
    }
  ]
})
