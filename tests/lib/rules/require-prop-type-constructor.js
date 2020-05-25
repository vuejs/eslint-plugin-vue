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

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
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
            ...props,
            myProp: Number,
            anotherType: [Number, String],
            extraProp: {
              type: Number,
              default: 10
            },
            lastProp: {
              type: [Number, Boolean]
            },
            nullProp: null,
            nullTypeProp: { type: null }
          }
        }
      `
    },
    {
      filename: 'ExtraCommas.vue',
      code: `
        export default {
          props: {
            name: [String,,]
          }
        }
      `
    },
    {
      filename: 'ExtraCommas.vue',
      code: `
        export default {
          props: {
            name: {
              type: [String,,]
            }
          }
        }
      `
    },
    {
      filename: 'ExtraCommas.vue',
      code: `
        export default {
          props: {
            name: [String,,Number]
          }
        }
      `
    },
    {
      filename: 'ExtraCommas.vue',
      code: `
        export default {
          props: {
            name: [,,Number]
          }
        }
      `
    },
    {
      filename: 'ExtraCommas.vue',
      code: `
        export default {
          props: ['name',,,]
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
          },
          nullProp: 'null'
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
          },
          nullProp: null
        }
      }
      `,
      errors: [
        {
          message: 'The "myProp" property should be a constructor.',
          line: 4
        },
        {
          message: 'The "anotherType" property should be a constructor.',
          line: 5
        },
        {
          message: 'The "anotherType" property should be a constructor.',
          line: 5
        },
        {
          message: 'The "extraProp" property should be a constructor.',
          line: 7
        },
        {
          message: 'The "lastProp" property should be a constructor.',
          line: 11
        },
        {
          message: 'The "nullProp" property should be a constructor.',
          line: 13
        }
      ]
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
      errors: [
        {
          message: 'The "a" property should be a constructor.',
          line: 4
        },
        {
          message: 'The "b" property should be a constructor.',
          line: 5
        },
        {
          message: 'The "c" property should be a constructor.',
          line: 6
        },
        {
          message: 'The "d" property should be a constructor.',
          line: 7
        }
      ]
    },
    {
      filename: 'SomeComponent.vue',
      code: `
      export default {
        props: {
          a: {
            type: 'String',
            default: 10
          } as PropOptions<string>,
        }
      }
      `,
      output: `
      export default {
        props: {
          a: {
            type: String,
            default: 10
          } as PropOptions<string>,
        }
      }
      `,
      errors: [
        {
          message: 'The "a" property should be a constructor.',
          line: 5
        }
      ],
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'ExtraCommas.vue',
      code: `
      export default {
        props: {
          name: ['String',,]
        }
      }
      `,
      output: `
      export default {
        props: {
          name: [String,,]
        }
      }
      `,
      errors: [
        {
          message: 'The "name" property should be a constructor.',
          line: 4
        }
      ],
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'LiteralsComponent.vue',
      code: `
      export default {
        props: {
          str: 'String',
          str2: 'a',
          emptyStr: '',
          number: 1000,
          binumber: 0b10000000000000000000000000000000,
          hexnumber: 0x123456789ABCDEF,
          exp1: 1E3,
          exp2: 2e6,
          exp3: 0.1e2,
          bigInt: 9007199254740991n,
          boolean: true,
          'null': null,
          regex: /a/,
          template: \`String\`,
          emptyTemplate: \`\`,
        }
      }
      `,
      output: `
      export default {
        props: {
          str: String,
          str2: a,
          emptyStr: '',
          number: 1000,
          binumber: 0b10000000000000000000000000000000,
          hexnumber: 0x123456789ABCDEF,
          exp1: 1E3,
          exp2: 2e6,
          exp3: 0.1e2,
          bigInt: 9007199254740991n,
          boolean: true,
          'null': null,
          regex: /a/,
          template: String,
          emptyTemplate: \`\`,
        }
      }
      `,
      errors: [
        {
          message: 'The "str" property should be a constructor.',
          line: 4
        },
        {
          message: 'The "str2" property should be a constructor.',
          line: 5
        },
        {
          message: 'The "emptyStr" property should be a constructor.',
          line: 6
        },
        {
          message: 'The "number" property should be a constructor.',
          line: 7
        },
        {
          message: 'The "binumber" property should be a constructor.',
          line: 8
        },
        {
          message: 'The "hexnumber" property should be a constructor.',
          line: 9
        },
        {
          message: 'The "exp1" property should be a constructor.',
          line: 10
        },
        {
          message: 'The "exp2" property should be a constructor.',
          line: 11
        },
        {
          message: 'The "exp3" property should be a constructor.',
          line: 12
        },
        {
          message: 'The "bigInt" property should be a constructor.',
          line: 13
        },
        {
          message: 'The "boolean" property should be a constructor.',
          line: 14
        },
        {
          message: 'The "regex" property should be a constructor.',
          line: 16
        },
        {
          message: 'The "template" property should be a constructor.',
          line: 17
        },
        {
          message: 'The "emptyTemplate" property should be a constructor.',
          line: 18
        }
      ]
    }
  ]
})
