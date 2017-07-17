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

const ruleTester = new RuleTester()
ruleTester.run('html-indent', rule, {

  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: '',
      errors: [{
        message: 'Fill me in.',
        type: 'Me too'
      }]
    }
  ]
})
