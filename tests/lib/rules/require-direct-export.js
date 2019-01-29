/**
 * @fileoverview require the component to be directly exported
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-direct-export')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: { jsx: true }
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('require-direct-export', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `
            export default {}
          `,
      parserOptions
    }
  ],

  invalid: [

    {
      filename: 'test.vue',
      code: `
          const A = {};
          export default A`,
      parserOptions,
      errors: [{
        message: 'Expected the component literal to be directly exported.',
        type: 'ExportDefaultDeclaration',
        line: 3
      }]
    }
  ]
})
