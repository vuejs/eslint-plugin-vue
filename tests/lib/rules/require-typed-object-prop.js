/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-typed-object-prop')

const ruleTester = new RuleTester()

ruleTester.run('require-typed-object-prop', rule, {
  valid: [
    // empty
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: {}
      }
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default Vue.extend({
        props: {}
      });
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      <script setup lang="ts">
      defineProps({});
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    // array props
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: ['foo']
      }
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default Vue.extend({
        props: ['foo']
      });
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      <script setup lang="ts">
      defineProps(['foo']);
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    // primitive props
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: { foo: String }
      }
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default Vue.extend({
        props: { foo: String }
      });
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      <script setup lang="ts">
      defineProps({ foo: String });
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    // union
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: { foo: [Number, String, Boolean] }
      }
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default Vue.extend({
        props: { foo: [Number, String, Boolean] }
      });
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      <script setup lang="ts">
      defineProps({ foo: [Number, String, Boolean] });
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    // function
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: { foo: someFunction() }
      }
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default Vue.extend({
        props: { foo: someFunction() }
      });
      `
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      <script setup lang="ts">
      defineProps({ foo: someFunction() });
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    // typed object
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: { foo: Object as PropType<User> }
      }
      `,
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default {
        props: { foo: Array as PropType<User[]> }
      }
      `,
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: `
      export default Vue.extend({
        props: { foo: Object as PropType<User> }
      });
      `,
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object as PropType<User> });
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },

    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: `
      export default {
        props: { foo: Object as () => User }
      }
      `,
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: `
      export default Vue.extend({
        props: { foo: Object as () => User }
      });
      `,
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object as () => User });
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    // any
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as any } });
      </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default {
          props: {
            foo: { type: Object as any }
          }
        };
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default Vue.extend({
          props: {
            foo: { type: Object as any }
          }
        });
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser')
    },
    // unknown
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as unknown } });
      </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default {
          props: {
            foo: { type: Object as unknown }
          }
        };
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default Vue.extend({
          props: {
            foo: { type: Object as unknown }
          }
        });
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser')
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object });
      </script>
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 32,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      <script setup lang="ts">
      defineProps({ foo: Object as PropType<any> });
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      <script setup lang="ts">
      defineProps({ foo: Object as PropType<unknown> });
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: Array });
      </script>
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 31,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any[]' },
              output: `
      <script setup lang="ts">
      defineProps({ foo: Array as PropType<any[]> });
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown[]' },
              output: `
      <script setup lang="ts">
      defineProps({ foo: Array as PropType<unknown[]> });
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: Object }
      }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 29,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      export default {
        props: { foo: Object as PropType<any> }
      }
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      export default {
        props: { foo: Object as PropType<unknown> }
      }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: Object }
      });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 29,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      export default Vue.extend({
        props: { foo: Object as PropType<any> }
      });
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      export default Vue.extend({
        props: { foo: Object as PropType<unknown> }
      });
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: { type: Object } }
      });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      export default Vue.extend({
        props: { foo: { type: Object as PropType<any> } }
      });
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      export default Vue.extend({
        props: { foo: { type: Object as PropType<unknown> } }
      });
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: { type: Object } }
      }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      export default {
        props: { foo: { type: Object as PropType<any> } }
      }
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      export default {
        props: { foo: { type: Object as PropType<unknown> } }
      }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object } });
      </script>
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 3,
          column: 34,
          endLine: 3,
          endColumn: 40,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as PropType<any> } });
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as PropType<unknown> } });
      </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
