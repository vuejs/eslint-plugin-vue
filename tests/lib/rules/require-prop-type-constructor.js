/**
 * @fileoverview require prop type to be a constructor
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-prop-type-constructor')
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
ruleTester.run('require-prop-type-constructor', rule, {

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
            },
            lastProp: {
              type: [Number, Boolean]
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
          },
          lastProp: {
            type: ['Boolean']
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
            type: Number,
            default: 10
          },
          lastProp: {
            type: [Boolean]
          }
        }
      }
      `,
      errors: [{
        message: 'The "myProp" property should be a constructor.',
        line: 4
      }, {
        message: 'The "anotherType" property should be a constructor.',
        line: 5
      }, {
        message: 'The "anotherType" property should be a constructor.',
        line: 5
      }, {
        message: 'The "type" property should be a constructor.',
        line: 7
      }, {
        message: 'The "type" property should be a constructor.',
        line: 11
      }]
    },
    {
      filename: 'SomeComponent.vue',
      code: `
      export default {
        props: {
          a: \`String\`,
          b: Foo + '',
          c: 1,
          d: true,
        }
      }
      `,
      output: `
      export default {
        props: {
          a: String,
          b: Foo + '',
          c: 1,
          d: true,
        }
      }
      `,
      errors: [{
        message: 'The "a" property should be a constructor.',
        line: 4
      }, {
        message: 'The "b" property should be a constructor.',
        line: 5
      }, {
        message: 'The "c" property should be a constructor.',
        line: 6
      }, {
        message: 'The "d" property should be a constructor.',
        line: 7
      }]
    }
  ]
})
