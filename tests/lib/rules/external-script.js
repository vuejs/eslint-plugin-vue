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
      code: '<template></template>\n<script src="./test.js"></script>',
      errors: [{
        message: "'<script>' cannot require external script files",
        line: 2
      }],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script :src="./test.js"></script>',
      errors: [{
        message: "'<script>' cannot require external script files",
        line: 1
      }],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script>',
      errors: [{
        message: "'<script>' must require external script files",
        line: 1
      }],
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script>\n</script>',
      errors: [{
        message: "'<script>' must require external script files",
        line: 1
      }],
      options: ['always']
    }
  ]
})
