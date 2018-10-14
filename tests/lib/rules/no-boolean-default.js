/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-boolean-default')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})
ruleTester.run('no-boolean-default', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: true,
            }
          }
        }
      `,
      options: ['default-false'],
      errors: [{
        message: 'Boolean prop should be defaulted to false.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: null,
            }
          }
        }
      `,
      options: ['default-false'],
      errors: [{
        message: 'Boolean prop should be defaulted to false.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: false,
            }
          }
        }
      `,
      options: ['no-default'],
      errors: [{
        message: 'Boolean prop should not set a default (Vue defaults it to false).',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
            }
          }
        }
      `,
      options: ['constructor'],
      errors: [{
        message: 'Boolean prop should use a constructor.',
        line: 4
      }]
    }
  ]
})
