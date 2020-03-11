/**
 * @fileoverview Ensure computed properties are not used in the data()
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-computed-in-data')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('no-computed-in-data', rule, {

  valid: [

    // give me some code that won't trigger a warning
  ],

  invalid: [
  ]
})
