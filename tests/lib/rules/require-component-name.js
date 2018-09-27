/**
 * @fileoverview Require components to have names
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-component-name')
const RuleTester = require('eslint').RuleTester
const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions })
ruleTester.run('require-component-name', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'test-component'
        }
      `
    }

    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
        }
      `,
      errors: [{
        message: 'Expected component to have a name.'
      }]
    }
  ]
})
