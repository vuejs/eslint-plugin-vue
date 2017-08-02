/**
 * @fileoverview Enforce consistent indentation in html template
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-indent')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})
ruleTester.run('html-indent', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: '<template>\n<div></div>\n</template>',
      options: [0]
    },
    {
      filename: 'test.vue',
      code: '<template>\n  <div></div>\n</template>',
      options: [2]
    },
    {
      filename: 'test.vue',
      code: '<template>\n\t<div></div>\n</template>',
      options: ['tab']
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div></div></template>',
      errors: [{
        message: 'Element has to be in new line.',
        type: 'Me too'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template>\n<div></div></template>',
      options: [2],
      errors: [{
        message: 'Element has to be in new line.',
        type: 'Me too'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template>\n\t<div></div></template>',
      options: [2],
      errors: [{
        message: 'Element has to be in new line.',
        type: 'Me too'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template>\n  <div></div>\n</template>',
      options: ['tab'],
      errors: [{
        message: 'Element has to be in new line.',
        type: 'Me too'
      }]
    },
    {
      code: '<template>\n  <div>\n<div></div></div></template>',
      errors: [{
        message: 'Element has to be in new line.',
        type: 'Me too'
      }]
    }
  ]
})
