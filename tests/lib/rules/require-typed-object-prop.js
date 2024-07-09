/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-typed-object-prop')

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 6,
    sourceType: 'module',
    parserOptions: {
      parser: require.resolve('@typescript-eslint/parser')
    }
  }
})

ruleTester.run('require-typed-object-prop', rule, {
  valid: [
    // empty
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: {}
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: {}
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({});
      </script>
      `
    },
    // array props
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: ['foo']
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: ['foo']
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps(['foo']);
      </script>
      `
    },
    // primitive props
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: { foo: String }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: String }
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: String });
      </script>
      `
    },
    // union
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: { foo: [Number, String, Boolean] }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: [Number, String, Boolean] }
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: [Number, String, Boolean] });
      </script>
      `
    },
    // function
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: { foo: someFunction() }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: someFunction() }
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: someFunction() });
      </script>
      `
    },
    // typed object
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: { foo: Object as PropType<User> }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: { foo: Array as PropType<User[]> }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: Object as PropType<User> }
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object as PropType<User> });
      </script>
      `
    },

    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        props: { foo: Object as () => User }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: Object as () => User }
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: Object as () => User });
      </script>
      `
    },
    // any
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as any } });
      </script>
      `
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
      `
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
      `
    },
    // unknown
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: Object as unknown } });
      </script>
      `
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
      `
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
      `
    },
    // JavaScript components
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({ foo: Object });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default Vue.extend({
        props: { foo: { type: Object } }
      });
      </script>
      `
    },
    {
      filename: 'test.js',
      code: `
      export default Vue.extend({
        props: { foo: Object }
      });
      `
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
      <script lang="ts">
      export default {
        props: { foo: Object }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 29,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      <script lang="ts">
      export default {
        props: { foo: Object as PropType<any> }
      }
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      <script lang="ts">
      export default {
        props: { foo: Object as PropType<unknown> }
      }
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
      <script lang="ts">
      export default Vue.extend({
        props: { foo: Object }
      });
      </script>
      `,
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 29,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: Object as PropType<any> }
      });
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: Object as PropType<unknown> }
      });
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
      <script lang="ts">
      export default Vue.extend({
        props: { foo: { type: Object } }
      });
      </script>
      `,
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: { type: Object as PropType<any> } }
      });
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: { type: Object as PropType<unknown> } }
      });
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
      <script lang="ts">
      export default {
        props: { foo: { type: Object } }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'expectedTypeAnnotation',
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'any' },
              output: `
      <script lang="ts">
      export default {
        props: { foo: { type: Object as PropType<any> } }
      }
      </script>
      `
            },
            {
              messageId: 'addTypeAnnotation',
              data: { type: 'unknown' },
              output: `
      <script lang="ts">
      export default {
        props: { foo: { type: Object as PropType<unknown> } }
      }
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
      defineProps({ foo: { type: Object } });
      </script>
      `,
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
    },
    {
      // `.ts` file
      filename: 'test.ts',
      code: `
      export default Vue.extend({
        props: { foo: Object }
      });
      `,
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
    }
  ]
})
