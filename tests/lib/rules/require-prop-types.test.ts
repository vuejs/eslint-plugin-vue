/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
 */
import rule from '../../../lib/rules/require-prop-types'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'
import { RuleTester } from '../../eslint-compat'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

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
        parser: tsParser,
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
        parser: tsParser,
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
        parser: vueEslintParser,
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
        parser: vueEslintParser,
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
      languageOptions: { parser: vueEslintParser }
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel(String)
      const foo = defineModel('foo', String)
      </script>
      `,
      languageOptions: { parser: vueEslintParser }
    },
    {
      code: `
      <script setup lang="ts">
      const m = defineModel<string>()
      const foo = defineModel<string>('foo')
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
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
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 24
        },
        {
          message: 'Prop "bar" should define at least its type.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 29
        },
        {
          message: 'Prop "baz" should define at least its type.',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 36
        },
        {
          message: 'Prop "Unknown prop" should define at least its type.',
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 43
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
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 24
        },
        {
          message: 'Prop "bar" should define at least its type.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 29
        },
        {
          message: 'Prop "baz" should define at least its type.',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 36
        },
        {
          message: 'Prop "Unknown prop" should define at least its type.',
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 43
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
          line: 4,
          column: 13,
          endLine: 5,
          endColumn: 14
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
          line: 4,
          column: 13,
          endLine: 6,
          endColumn: 14
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
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 21
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
        parser: tsParser,
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 43
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
        parser: tsParser,
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 43
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
        parser: vueEslintParser,
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 16
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
        parser: vueEslintParser,
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 25
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
      languageOptions: { parser: vueEslintParser },
      errors: [
        {
          message: 'Prop "modelValue" should define at least its type.',
          line: 3,
          column: 17,
          endLine: 3,
          endColumn: 30
        },
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 37
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
      languageOptions: { parser: vueEslintParser },
      errors: [
        {
          message: 'Prop "modelValue" should define at least its type.',
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 31
        },
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4,
          column: 37,
          endLine: 4,
          endColumn: 39
        }
      ]
    }
  ]
})
