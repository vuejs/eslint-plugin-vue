/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const rule = require('../../../lib/rules/order-in-components')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

ruleTester.run('order-in-components', rule, {

  valid: [
    {
      code: `
      `
    }
  ],

  invalid: [
    {
      code: ``,
      errors: [{
        message: 'Fill me in.'
      }]
    }
  ]
})
