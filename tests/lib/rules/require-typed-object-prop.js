/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-typed-object-prop')

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser')
  }
})

ruleTester.run('require-typed-object-prop', rule, {
  valid: [
    // empty
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
      export default Vue.extend({
        props: {}
      });
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({});
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    // array props
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo']
      }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: ['foo']
      });
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps(['foo']);
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    // primitive props
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: String }
      }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: String }
      });
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: String });
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    // union
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: [Number, String, Boolean] }
      }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: [Number, String, Boolean] }
      });
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: [Number, String, Boolean] });
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    // function
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: someFunction() }
      }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: someFunction() }
      });
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: someFunction() });
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    // typed object
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: Object as PropType<User> }
      }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: Array as PropType<User[]> }
      }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: Object as PropType<User> }
      });
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object as PropType<User> });
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
      filename: 'test.vue',
      code: `
      export default {
        props: { foo: Object as () => User }
      }
      `,
      languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
      export default Vue.extend({
        props: { foo: Object as () => User }
      });
      `,
      languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object as () => User });
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
    // any
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as any } });
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    // unknown
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as unknown } });
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
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
