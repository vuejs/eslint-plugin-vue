/**
 * @fileoverview disallow usage of strings as prop types
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-string-prop-type')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module'
  }
})
ruleTester.run('no-string-prop-type', rule, {

  valid: [
    {
      filename: 'SomeComponent.vue',
      code: `
        export default {
          props: {
            myProp: Number,
            anotherType: [Number, String],
            extraProp: {
              type: Number,
              default: 10
            }
          }
        }
      `
    }
  ],

  invalid: [
    {
      filename: 'SomeComponent.vue',
      code: `
      export default {
        props: {
          myProp: 'Number',
          anotherType: ['Number', 'String'],
          extraProp: {
            type: 'Number',
            default: 10
          }
        }
      }
      `,
      output: `
      export default {
        props: {
          myProp: Number,
          anotherType: [Number, String],
          extraProp: {
            type: 'Number',
            default: 10
          }
        }
      }
      `,
      errors: [{
        message: '"type" property of prop should be of Object type, not String',
        line: 4
      }, {
        message: '"type" property of prop should be of Object type, not String',
        line: 5
      }, {
        message: '"type" property of prop should be of Object type, not String',
        line: 7
      }]
    }
  ]
})
