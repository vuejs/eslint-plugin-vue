/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (https://github.com/michalsnik)
 */
'use strict'

const rule = require('../../../lib/rules/require-default-prop')
const RuleTester = require('../../eslint-compat').RuleTester
const languageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}

const ruleTester = new RuleTester({ languageOptions })
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
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            a: {
              type: String,
              required: true
            } as PropOptions<string>
          }
        });
      `,

      languageOptions: {
        parser: require('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            a: {
              type: String,
              required: true
            } as PropOptions<string>
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            bar,
            baz: prop,
            baz1: prop.foo,
            bar2: foo()
          }
        }
      `
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1040
      filename: 'destructuring-test.vue',
      code: `
        export default {
          props: {
            foo: {
              ...foo,
              default: 0
            },
          }
        }
      `
    },
    {
      filename: 'unknown-prop-details-test.vue',
      code: `
        export default {
          props: {
            foo: {
              [bar]: true,
              default: 0
            },
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo']
      }`,
      languageOptions
    },

    // sparse array
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            a: {
              type: [,Boolean]
            },
            b: [,Boolean],
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {
          type: String,
          default: ''
        }
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo?: number
      }
      defineProps<Props>()
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo?: number
      }
      withDefaults(defineProps<Props>(), {foo:42})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo?: number
      }
      defineProps<Props>({
        foo:{
          default: 42
        }
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1591
      filename: 'test.vue',
      code: `
      <template>
        <div>
          {{ required }}
          {{ optional }}
        </div>
      </template>

      <script setup lang="ts">
      import { defineProps, withDefaults } from 'vue';

      interface Props {
        required: boolean;
        optional?: boolean;
      }

      const props = withDefaults(defineProps<Props>(), {
        optional: false,
      });
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        optional?: boolean;
      }

      const props = defineProps<Props>();
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const defaultProps = {
        foo: 'foo',
      }
      withDefaults(defineProps<{
        foo: string;
        bar?: number;
      }>(), {
        ...defaultProps,
        bar: 42,
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo=42,bar=42} = defineProps({foo: Number, bar: {type: Number}})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo,bar} = defineProps({foo: Boolean, bar: {type: Boolean}})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      // ignore
      const {bar = 42, foo = 42} = defineProps({[x]: Number, bar: {type: Number}})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {bar=42} = defineProps({foo: {type: Number, required: true}, bar: {type: Number, required: false}})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const {foo = 42, bar} = defineProps<{foo?: number; bar: number}>()
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
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
      errors: [
        {
          message: `Prop 'a' requires default value to be set.`,
          line: 4
        },
        {
          message: `Prop 'b' requires default value to be set.`,
          line: 5
        },
        {
          message: `Prop 'c' requires default value to be set.`,
          line: 6
        },
        {
          message: `Prop 'd' requires default value to be set.`,
          line: 9
        },
        {
          message: `Prop 'e' requires default value to be set.`,
          line: 13
        },
        {
          message: `Prop 'f' requires default value to be set.`,
          line: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            a: {
              type: String
            } as PropOptions<string>
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser')
      },
      errors: [
        {
          message: `Prop 'a' requires default value to be set.`,
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            a: {
              type: String
            } as PropOptions<string>
          }
        });
      `,
      languageOptions: { parser: require('@typescript-eslint/parser') },
      errors: [
        {
          message: `Prop 'a' requires default value to be set.`,
          line: 4
        }
      ]
    },

    // computed properties
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            a: String,
            'b': String,
            ['c']: String,
            [\`d\`]: String,
          }
        };
      `,
      errors: [
        {
          message: `Prop 'a' requires default value to be set.`,
          line: 4
        },
        {
          message: `Prop 'b' requires default value to be set.`,
          line: 5
        },
        {
          message: `Prop 'c' requires default value to be set.`,
          line: 6
        },
        {
          message: `Prop 'd' requires default value to be set.`,
          line: 7
        }
      ]
    },
    // unknown static name
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [foo]: String,
            [bar()]: String,
            [baz.baz]: String,
          }
        };
      `,
      errors: [
        {
          message: `Prop '[foo]' requires default value to be set.`,
          line: 4
        },
        {
          message: `Prop '[bar()]' requires default value to be set.`,
          line: 5
        },
        {
          message: `Prop '[baz.baz]' requires default value to be set.`,
          line: 6
        }
      ]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1040
      filename: 'destructuring-test.vue',
      code: `
        export default {
          props: {
            foo: {
              ...foo
            },
          }
        }
      `,
      errors: ["Prop 'foo' requires default value to be set."]
    },
    {
      filename: 'unknown-prop-details-test.vue',
      code: `
        export default {
          props: {
            foo: {
              [bar]: true
            },
          }
        }
      `,
      errors: ["Prop 'foo' requires default value to be set."]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            bar,
            baz: prop?.foo,
            bar1: foo?.(),
          }
        }
      `,
      errors: [
        "Prop 'baz' requires default value to be set.",
        "Prop 'bar1' requires default value to be set."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: String
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message: "Prop 'foo' requires default value to be set.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const defaultProps = {
        foo: 'foo',
      }
      withDefaults(defineProps<{
        foo: string;
        bar?: number;
      }>(), {
        ...defaultProps,
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          message: "Prop 'bar' requires default value to be set.",
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo?: number
      }
      withDefaults(defineProps<Props>(), {bar:42})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Prop 'foo' requires default value to be set.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo,bar} = defineProps({foo: Boolean, bar: {type: String}})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message: "Prop 'bar' requires default value to be set.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo,bar} = defineProps({foo: Number, bar: {type: Number}})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message: "Prop 'foo' requires default value to be set.",
          line: 3
        },
        {
          message: "Prop 'bar' requires default value to be set.",
          line: 3
        }
      ]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2725
      filename: 'type-with-props-destructure.vue',
      code: `
      <script setup lang="ts">
      const {foo, bar} = defineProps<{foo?: number; bar: number}>()
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          message: "Prop 'foo' requires default value to be set.",
          line: 3
        }
      ]
    }
  ]
})
