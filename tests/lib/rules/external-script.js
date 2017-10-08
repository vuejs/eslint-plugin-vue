/**
 * @fileoverview external-script
 * @author Pietari Heino
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/external-script')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('external-script', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: '<template></template><script></script>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script src="./test.js"></script>',
      options: ['always']
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template></template><script src="./test.js"></script>',
      errors: ["'<script>' cannot require external script files"],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script :src="./test.js"></script>',
      errors: ["'<script>' cannot require external script files"],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script>',
      errors: ["'<script>' must require external script files"],
      options: ['always']
    }
  ]
})
