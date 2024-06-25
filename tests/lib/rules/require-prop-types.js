/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/require-prop-types')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester()
ruleTester.run('require-prop-types', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo,
          props: {
            ...test(),
            foo: String
          }
        }
      `,
      languageOptions: { ecmaVersion: 2018, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: [String, Number]
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: String
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              ['type']: String
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              validator: v => v
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              ['validator']: v => v
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: externalProps
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: []
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {}
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {
              type: String
            } as PropOptions<string>
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
      code: `
        export default Vue.extend({
          props: {
            foo: {
              type: String
            } as PropOptions<string>
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
      code: `
      <script setup>
      defineProps({
        foo: String
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{foo:string}>()
      </script>
      `,
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
      import {Props1 as Props} from './test01'
      defineProps<Props>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel({type:String})
      const foo = defineModel('foo', {type:String})
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel(String)
      const foo = defineModel('foo', String)
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
    },
    {
      code: `
      <script setup lang="ts">
      const m = defineModel<string>()
      const foo = defineModel<string>('foo')
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo', bar, \`baz\`, foo()]
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "bar" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "baz" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "Unknown prop" should define at least its type.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          props: ['foo', bar, \`baz\`, foo()]
        })
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "bar" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "baz" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "Unknown prop" should define at least its type.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: []
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo() {}
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            foo: {} as PropOptions<string>
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {} as PropOptions<string>
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {}
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
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
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3
        }
      ]
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel()
      const foo = defineModel('foo')
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message: 'Prop "modelValue" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel({})
      const foo = defineModel('foo',{})
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message: 'Prop "modelValue" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    }
  ]
})
