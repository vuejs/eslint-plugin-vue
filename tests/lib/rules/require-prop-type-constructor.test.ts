/**
 * @fileoverview require prop type to be a constructor
 * @author Michał Sajnóg
 */
import rule from '../../../lib/rules/require-prop-type-constructor'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'
import { RuleTester } from '../../eslint-compat'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: {
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
    },
    {
      code: `
      <script setup lang="ts">
      import {Props1 as Props} from './test01'
      defineProps<Props>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
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
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 27
        },
        {
          message: 'The "anotherType" property should be a constructor.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 33
        },
        {
          message: 'The "anotherType" property should be a constructor.',
          line: 5,
          column: 35,
          endLine: 5,
          endColumn: 43
        },
        {
          message: 'The "extraProp" property should be a constructor.',
          line: 7,
          column: 19,
          endLine: 7,
          endColumn: 27
        },
        {
          message: 'The "lastProp" property should be a constructor.',
          line: 11,
          column: 20,
          endLine: 11,
          endColumn: 29
        },
        {
          message: 'The "nullProp" property should be a constructor.',
          line: 13,
          column: 21,
          endLine: 13,
          endColumn: 27
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
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 22
        },
        {
          message: 'The "b" property should be a constructor.',
          line: 5,
          column: 14,
          endLine: 5,
          endColumn: 22
        },
        {
          message: 'The "c" property should be a constructor.',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 15
        },
        {
          message: 'The "d" property should be a constructor.',
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 18
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
      languageOptions: { parser: tsParser },
      errors: [
        {
          message: 'The "a" property should be a constructor.',
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 27
        }
      ]
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
      languageOptions: { parser: tsParser },
      errors: [
        {
          message: 'The "name" property should be a constructor.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 26
        }
      ]
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
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 24
        },
        {
          message: 'The "str2" property should be a constructor.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 20
        },
        {
          message: 'The "emptyStr" property should be a constructor.',
          line: 6,
          column: 21,
          endLine: 6,
          endColumn: 23
        },
        {
          message: 'The "number" property should be a constructor.',
          line: 7,
          column: 19,
          endLine: 7,
          endColumn: 23
        },
        {
          message: 'The "binumber" property should be a constructor.',
          line: 8,
          column: 21,
          endLine: 8,
          endColumn: 55
        },
        {
          message: 'The "hexnumber" property should be a constructor.',
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 39
        },
        {
          message: 'The "exp1" property should be a constructor.',
          line: 10,
          column: 17,
          endLine: 10,
          endColumn: 20
        },
        {
          message: 'The "exp2" property should be a constructor.',
          line: 11,
          column: 17,
          endLine: 11,
          endColumn: 20
        },
        {
          message: 'The "exp3" property should be a constructor.',
          line: 12,
          column: 17,
          endLine: 12,
          endColumn: 22
        },
        {
          message: 'The "bigInt" property should be a constructor.',
          line: 13,
          column: 19,
          endLine: 13,
          endColumn: 36
        },
        {
          message: 'The "boolean" property should be a constructor.',
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 24
        },
        {
          message: 'The "regex" property should be a constructor.',
          line: 16,
          column: 18,
          endLine: 16,
          endColumn: 21
        },
        {
          message: 'The "template" property should be a constructor.',
          line: 17,
          column: 21,
          endLine: 17,
          endColumn: 29
        },
        {
          message: 'The "emptyTemplate" property should be a constructor.',
          line: 18,
          column: 26,
          endLine: 18,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'SomeComponent.vue',
      code: `
      <script setup>
      defineProps({
        a: {
          type: 'String',
          default: 'abc'
        },
      })
      </script>
      `,
      output: `
      <script setup>
      defineProps({
        a: {
          type: String,
          default: 'abc'
        },
      })
      </script>
      `,
      languageOptions: { parser: vueEslintParser },
      errors: [
        {
          message: 'The "a" property should be a constructor.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 25
        }
      ]
    }
  ]
})
