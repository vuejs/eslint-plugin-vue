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
const rule = require('../../../lib/rules/no-textarea-mustache')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-textarea-mustache', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><textarea v-model="text"></textarea></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><textarea>{{text}}</textarea></div></template>',
      errors: ["Unexpected mustache. Use 'v-model' instead."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><textarea>{{text}} and {{text}}</textarea></div></template>',
      errors: [
        "Unexpected mustache. Use 'v-model' instead.",
        "Unexpected mustache. Use 'v-model' instead."
      ]
    }
  ]
})
