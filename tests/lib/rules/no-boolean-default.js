/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
'use strict'

const rule = require('../../../lib/rules/no-boolean-default')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
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
      languageOptions: { parser: require('vue-eslint-parser') }
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
      options: ['default-false'],
      languageOptions: { parser: require('vue-eslint-parser') }
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
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
        foo: boolean
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
      options: ['default-false'],
      languageOptions: {
        parser: require('vue-eslint-parser'),
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
        foo: boolean | string
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
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
        foo: string
      }
      withDefaults(defineProps<Props>(), {
        foo: false
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo = false} = defineProps({foo: Boolean})
      </script>
      `,
      options: ['default-false'],
      languageOptions: {
        parser: require('vue-eslint-parser')
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
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 28
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
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 28
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
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 29
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
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 28
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
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message:
            'Boolean prop should not set a default (Vue defaults it to false).',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 25
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
      options: ['default-false'],
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message: 'Boolean prop should only be defaulted to false.',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 24
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
        foo: false
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            'Boolean prop should not set a default (Vue defaults it to false).',
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 19
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
      options: ['default-false'],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Boolean prop should only be defaulted to false.',
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo = false} = defineProps({foo: Boolean})
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message:
            'Boolean prop should not set a default (Vue defaults it to false).',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo = true} = defineProps({foo: Boolean})
      </script>
      `,
      options: ['default-false'],
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: 'Boolean prop should only be defaulted to false.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 24
        }
      ]
    }
  ]
})
