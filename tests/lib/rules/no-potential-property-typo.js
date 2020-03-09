/**
 * @fileoverview detect if there is a potential typo in your component property
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-potential-property-typo')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('no-potential-property-typo', rule, {

  valid: [

    // give me some code that won't trigger a warning
  ],

  invalid: [
  ]
})
