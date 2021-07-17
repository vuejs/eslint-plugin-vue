/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const semver = require('semver')
const rule = require('../../../lib/rules/no-boolean-default')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-boolean-default', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const props = {};
        export default {
          props: {
            ...props,
            enabled: Boolean
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const props = {};
        export default {
          props: {
            ...props,
            enabled: Boolean
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const props = {};
        export default {
          props: {
            ...props,
            enabled: Boolean
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              ...data
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              ...data
            }
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              ...data
            }
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: false,
              ...data
            }
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: data
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: data
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: data
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              ...data
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              ...data
            }
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              ...data
            }
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {
          type:Boolean
        }
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {
          type:Boolean,
          default: false
        }
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: boolean
      }
      withDefaults(defineProps<Props>(), {
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: boolean
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: boolean | string
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: string
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: true,
            }
          }
        }
      `,
      options: ['default-false'],
      errors: [
        {
          message: 'Boolean prop should only be defaulted to false.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: null,
            }
          }
        }
      `,
      options: ['default-false'],
      errors: [
        {
          message: 'Boolean prop should only be defaulted to false.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: false,
            }
          }
        }
      `,
      options: ['no-default'],
      errors: [
        {
          message:
            'Boolean prop should not set a default (Vue defaults it to false).',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: true,
            }
          }
        }
      `,
      options: ['no-default'],
      errors: [
        {
          message:
            'Boolean prop should not set a default (Vue defaults it to false).',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {
          type:Boolean,
          default: false
        }
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          message:
            'Boolean prop should not set a default (Vue defaults it to false).',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {
          type:Boolean,
          default: true
        }
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      options: ['default-false'],
      errors: [
        {
          message: 'Boolean prop should only be defaulted to false.',
          line: 6
        }
      ]
    },
    ...(semver.lt(
      require('@typescript-eslint/parser/package.json').version,
      '4.0.0'
    )
      ? []
      : [
          {
            filename: 'test.vue',
            code: `
      <script setup lang="ts">
      interface Props {
        foo: boolean
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
            parser: require.resolve('vue-eslint-parser'),
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            errors: [
              {
                message:
                  'Boolean prop should not set a default (Vue defaults it to false).',
                line: 7
              }
            ]
          },
          {
            filename: 'test.vue',
            code: `
      <script setup lang="ts">
      interface Props {
        foo: boolean
      }
      withDefaults(defineProps<Props>(), {
        foo: true
      })
      </script>
      `,
            parser: require.resolve('vue-eslint-parser'),
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            options: ['default-false'],
            errors: [
              {
                message: 'Boolean prop should only be defaulted to false.',
                line: 7
              }
            ]
          }
        ])
  ]
})
