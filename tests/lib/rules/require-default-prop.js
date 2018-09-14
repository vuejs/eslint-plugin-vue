/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (http://github.com/michalsnik)
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-default-prop')
const RuleTester = require('eslint').RuleTester
const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions })
ruleTester.run('require-default-prop', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            a: {
              type: Number,
              required: true
            },
            b: {
              type: Number,
              default: 0
            },
            c: {
              type: Number,
              required: false,
              default: 0
            },
            d: {
              type: String,
              required: false,
              'default': 'lorem'
            },
            e: {
              type: Boolean
            },
            f: {
              type: Boolean,
              required: false
            },
            g: {
              type: Boolean,
              default: true
            },
            h: {
              type: [Boolean]
            },
            i: Boolean,
            j: [Boolean],
            // eslint-disable-next-line require-default-prop
            k: Number
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            ...x,
            a: {
              ...y,
              type: Number,
              required: true
            },
            b: {
              type: Number,
              default: 0
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const x = {
          type: Object,
          default() {
            return {
              foo: 1,
              bar: 2
            }
          }
        }
        export default {
          props: {
            a: {
              ...x,
              default() {
                return {
                  ...x.default(),
                  baz: 3
                }
              }
            }
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
            a: Number,
            b: [Number, String],
            c: {
              type: Number
            },
            d: {
              type: Number,
              required: false
            },
            e: [Boolean, String],
            f: {
              type: [Boolean, String],
            }
          }
        }
      `,
      errors: [{
        message: `Prop 'a' requires default value to be set.`,
        line: 4
      }, {
        message: `Prop 'b' requires default value to be set.`,
        line: 5
      }, {
        message: `Prop 'c' requires default value to be set.`,
        line: 6
      }, {
        message: `Prop 'd' requires default value to be set.`,
        line: 9
      }, {
        message: `Prop 'e' requires default value to be set.`,
        line: 13
      }, {
        message: `Prop 'f' requires default value to be set.`,
        line: 14
      }]
    }
  ]
})
