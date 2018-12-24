/**
 * @fileoverview  Prevents require: false on props.
 * @author sizer
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-require-false')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-require-false', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: string,
              default: '',
            },
          },
        }
      `,
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: string,
              default: '',
              require: false,
            },
          }
        }
      `,
      parserOptions,
      errors: [{
        message: "Remove require: false on 'foo'.",
        line: 7
      }]
    }]
})
