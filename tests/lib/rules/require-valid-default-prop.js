/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/require-valid-default-prop')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
  parserOptions: {
    ecmaFeatures: { jsx: true }
  }
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

const ruleTester = new RuleTester()
ruleTester.run('require-valid-default-prop', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `export default {
        ...foo,
        props: { ...foo }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: { foo: null }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: ['foo']
      }`,
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Array as PropType<string[]>,
              default: () => []
            }
          }
        });
      `,
      errors: errorMessage('function'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Object as PropType<{ [key: number]: number }>,
              default: () => {}
            }
          }
        });
      `,
      errors: errorMessage('function'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Function as PropType<() => number>,
              default: () => 10
            }
          }
        });
      `,
      errors: errorMessage('function'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1853
      filename: 'test.vue',
      code: `<script setup lang="ts">
      export interface SomePropInterface {
        someProp?: false | string;
        str?: 'foo' | 'bar';
        num?: 1 | 2;
      }

      withDefaults(defineProps<SomePropInterface>(), {
        someProp: false,
        str: 'foo',
        num: 1
      });
      </script>`,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Props2 as Props} from './test01'
      withDefaults(defineProps<Props>(), {
        a: 's',
        b: 42,
        c: true,
        d: false,
        e: 's',
        f: () => 42,
        g: ()=>({ foo: 'foo' }),
        h: ()=>(['foo', 'bar']),
        i: ()=>(['foo', 'bar']),
      })
      </script>`,
      ...getTypeScriptFixtureTestOptions()
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
      errors: errorMessage('number or string'),
      languageOptions
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
      errors: errorMessage('number or function'),
      languageOptions
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
      errors: errorMessage('number'),
      languageOptions
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
      errors: errorMessage('number'),
      languageOptions
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
      errors: errorMessage('number'),
      languageOptions
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
      errors: errorMessage('number'),
      languageOptions
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
      errors: errorMessage('string'),
      languageOptions
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
      errors: errorMessage('string'),
      languageOptions
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
      errors: errorMessage('string'),
      languageOptions
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
      errors: errorMessage('boolean'),
      languageOptions
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
      errors: errorMessage('boolean'),
      languageOptions
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
      errors: errorMessage('boolean'),
      languageOptions
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
      errors: errorMessage('boolean'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      errors: errorMessage('function or number'),
      languageOptions
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

      errors: errorMessage('function or number'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
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
      ],
      languageOptions
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
      errors: errorMessage('string'),
      languageOptions
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
      errors: errorMessageForFunction('number'),
      languageOptions
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
      errors: errorMessageForFunction('object'),
      languageOptions
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
      errors: errorMessageForFunction('string'),
      languageOptions
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
      errors: errorMessageForFunction('number'),
      languageOptions
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
      errors: errorMessageForFunction('object'),
      languageOptions
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
      errors: errorMessageForFunction('string'),
      languageOptions
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
      errors: errorMessage('number'),
      languageOptions
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
      errors: errorMessage('object'),
      languageOptions
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
      errors: errorMessage('string'),
      languageOptions
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
      errors: errorMessage('function'),
      languageOptions
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
      ],
      languageOptions
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
      errors: errorMessage('string'),
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Array as PropType<string[]>,
              default: []
            }
          }
        });
      `,
      errors: errorMessage('function'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Object as PropType<{ [key: number]: number }>,
              default: {}
            }
          }
        });
      `,
      errors: errorMessage('function'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Function as PropType<() => number>,
              default: 10
            }
          }
        });
      `,
      errors: errorMessage('function'),
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineProps({
          foo: {
            type: String,
            default: () => 123
          }
        })
      </script>
      `,
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 6
        }
      ],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        withDefaults(defineProps<{foo:string}>(),{
          foo: () => 123
        })
      </script>
      `,
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 4
        }
      ],
      languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Props2 as Props} from './test01'
      withDefaults(defineProps<Props>(), {
        a: 42,
        b: 's',
        c: {},
        d: [],
        e: [42],
        f: {},
        g: { foo: 'foo' },
        h: ['foo', 'bar'],
        i: ['foo', 'bar'],
      })
      </script>`,
      errors: [
        {
          message: "Type of the default value for 'a' prop must be a string.",
          line: 5
        },
        {
          message: "Type of the default value for 'b' prop must be a number.",
          line: 6
        },
        {
          message: "Type of the default value for 'c' prop must be a boolean.",
          line: 7
        },
        {
          message: "Type of the default value for 'd' prop must be a boolean.",
          line: 8
        },
        {
          message:
            "Type of the default value for 'e' prop must be a string or number.",
          line: 9
        },
        {
          message: "Type of the default value for 'f' prop must be a function.",
          line: 10
        },
        {
          message: "Type of the default value for 'g' prop must be a function.",
          line: 11
        },
        {
          message: "Type of the default value for 'h' prop must be a function.",
          line: 12
        },
        {
          message: "Type of the default value for 'i' prop must be a function.",
          line: 13
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    }
  ]
})
