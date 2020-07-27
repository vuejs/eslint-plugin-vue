/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-valid-default-prop')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
  ecmaFeatures: { jsx: true }
}

function errorMessage(type) {
  return [
    {
      message: `Type of the default value for 'foo' prop must be a ${type}.`,
      line: 5
    }
  ]
}

function errorMessageForFunction(type) {
  return [
    {
      message: `Type of the default value for 'foo' prop must be a ${type}.`,
      line: 6
    }
  ]
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('require-valid-default-prop', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `export default {
        ...foo,
        props: { ...foo }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: { foo: null }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: ['foo']
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Object, Number],
            default: 10
          }
        }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('example', {
        props: {
          foo: null,
          foo: Number,
          foo: [String, Number],
          foo: { },
          foo: { type: String },
          foo: { type: Number, default: VAR_BAR },
          foo: { type: Number, default: 100 },
          foo: { type: Number, default: Number.MAX_VALUE },
          foo: { type: Number, default: Foo.BAR },
          foo: { type: {}, default: '' },
          foo: { type: [String, Number], default: '' },
          foo: { type: [String, Number], default: 0 },
          foo: { type: String, default: '' },
          foo: { type: String, default: \`\` },
          foo: { type: Boolean, default: false },
          foo: { type: Object, default: () => { } },
          foo: { type: Array, default () { } },
          foo: { type: String, default () { } },
          foo: { type: Number, default () { } },
          foo: { type: Boolean, default () { } },
          foo: { type: Symbol, default () { } },
          foo: { type: Array, default () { } },
          foo: { type: Symbol, default: Symbol('a') },
          foo: { type: String, default: \`Foo\` },
          foo: { type: Foo, default: Foo('a') },
          foo: { type: String, default: \`Foo\` },
          foo: { type: BigInt, default: 1n },
          foo: { type: String, default: null },
          foo: { type: String, default () { return Foo } },
          foo: { type: Number, default () { return Foo } },
          foo: { type: Object, default () { return Foo } },
        }
      })`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {
              type: [Object, Number],
              default: 10
            } as PropOptions<object>
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number],
            default() {
              return 10
            }
          }
        }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Function, Number],
            default() {
              return 's'
            }
          }
        }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number],
            default: () => 10
          }
        }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Function, Number],
            default: () => 's'
          }
        }
      }`,
      parserOptions
    },

    // sparse array
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [,Object, Number],
            default: 10
          }
        }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: Number?.()
          }
        }
      }`,
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number, String],
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number or string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number, Object],
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number or function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: ''
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: false
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: []
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: 2
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: []
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: ''
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: 5
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: []
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: ''
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: 55
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: false
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: []
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: ''
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: 55
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: false
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: []
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Object, Number],
            default: {}
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function or number')
    },
    {
      filename: 'test.vue',
      code: `export default (Vue as VueConstructor<Vue>).extend({
        props: {
          foo: {
            type: [Object, Number],
            default: {}
          } as PropOptions<object>
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('@typescript-eslint/parser'),
      errors: errorMessage('function or number')
    },

    {
      filename: 'test.vue',
      code: `export default {
        props: {
          'foo': {
            type: Object,
            default: ''
          },
          ['bar']: {
            type: Object,
            default: ''
          },
          [baz]: {
            type: Object,
            default: ''
          }
        }
      }`,
      parserOptions,
      errors: [
        {
          message: `Type of the default value for 'foo' prop must be a function.`,
          line: 5
        },
        {
          message: `Type of the default value for 'bar' prop must be a function.`,
          line: 9
        },
        {
          message: `Type of the default value for '[baz]' prop must be a function.`,
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: 1n
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default() {
              return ''
            }
          }
        }
      }`,
      parserOptions,
      errors: errorMessageForFunction('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default() {
              return ''
            }
          }
        }
      }`,
      parserOptions,
      errors: errorMessageForFunction('object')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default() {
              return 123
            }
          }
        }
      }`,
      parserOptions,
      errors: errorMessageForFunction('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: () => {
              return ''
            }
          }
        }
      }`,
      parserOptions,
      errors: errorMessageForFunction('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: () => {
              return ''
            }
          }
        }
      }`,
      parserOptions,
      errors: errorMessageForFunction('object')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: () => {
              return 123
            }
          }
        }
      }`,
      parserOptions,
      errors: errorMessageForFunction('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: () => ''
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: () => ''
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('object')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: () => 123
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Function,
            default: 1
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [String, Boolean],
            default() {
              switch (kind) {
                case 1: return 1
                case 2: return '' // OK
                case 3: return {}
                case 4: return Foo // ignore?
                case 5: return () => {}
                case 6: return false // OK
              }

              function foo () {
                return 1 // ignore?
              }
            }
          }
        }
      }`,
      parserOptions,
      errors: [
        {
          message:
            "Type of the default value for 'foo' prop must be a string or boolean.",
          line: 7
        },
        {
          message:
            "Type of the default value for 'foo' prop must be a string or boolean.",
          line: 9
        },
        {
          message:
            "Type of the default value for 'foo' prop must be a string or boolean.",
          line: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: Number?.()
          }
        }
      }`,
      parserOptions,
      errors: errorMessage('string')
    }
  ]
})
