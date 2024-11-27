/**
 * @fileoverview Disable inheritAttrs when using v-bind=&#34;$attrs&#34;
 * @author Hiroki Osame
 */
'use strict'

const rule = require('../../../lib/rules/no-duplicate-attr-inheritance')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-duplicate-attr-inheritance', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><div><div></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div></div></div></template>
        <script>
        export default { inheritAttrs: true }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div></div></div></template>
        <script>
        const data = {};
        export default {
          ...data,
          inheritAttrs: true
        }
        </script>
      `
    },
    // ignore multi root by default
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({ inheritAttrs: true })
      </script>
      <template><div v-bind="$attrs"/><div/></template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1"></div>
        <div v-if="condition2" v-bind="$attrs"></div>
        <div v-else></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1"></div>
        <div v-else-if="condition2"></div>
        <div v-bind="$attrs"></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-bind="$attrs"></div>
        <div v-if="condition1"></div>
        <div v-else></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1"></div>
        <div v-else-if="condition2"></div>
        <div v-if="condition3" v-bind="$attrs"></div>
      </template>
      `,
      options: [{ checkMultiRootNodes: false }]
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div></div></div></template>
        <script>
        const inheritAttrs = false;
        export default { inheritAttrs }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind="$attrs"></div></div></template>
        <script>
        export default { inheritAttrs: false }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind="$attrs"></div></div></template>
        <script>
        export default { inheritAttrs: 0 }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind:foo="$attrs"></div></div></template>
        <script>
        export default {  }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default { inheritAttrs: false }
      </script>
      <script setup>
      </script>
      <template><div v-bind="$attrs" /></template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({ inheritAttrs: false })
      </script>
      <template><div v-bind="$attrs" /></template>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-bind="$attrs"></div></div></template>',
      errors: ['Set "inheritAttrs" to false.']
    },
    {
      filename: 'test.vue',
      code: `
        <template><div><div v-bind="$attrs"></div></div></template>
        <script>
        export default {
          inheritAttrs: true
        }
        </script>
      `,
      errors: ['Set "inheritAttrs" to false.']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default { inheritAttrs: true }
      </script>
      <script setup>
      </script>
      <template><div v-bind="$attrs" /></template>
      `,
      errors: [
        {
          message: 'Set "inheritAttrs" to false.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({ inheritAttrs: true })
      </script>
      <template><div v-bind="$attrs" /></template>
      `,
      errors: [
        {
          message: 'Set "inheritAttrs" to false.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div v-bind="$attrs"></div><div></div></template>`,
      options: [{ checkMultiRootNodes: true }],
      errors: [{ message: 'Set "inheritAttrs" to false.' }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1" v-bind="$attrs"></div>
        <div v-else></div>
        <div v-if="condition2"></div>
      </template>
      `,
      options: [{ checkMultiRootNodes: true }],
      errors: [{ message: 'Set "inheritAttrs" to false.' }]
    },
    // condition group as a single root node
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1" v-bind="$attrs"></div>
        <div v-else-if="condition2"></div>
        <div v-else></div>
      </template>
      `,
      errors: [{ message: 'Set "inheritAttrs" to false.' }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1" v-bind="$attrs"></div>
        <div v-else-if="condition2"></div>
        <div v-else-if="condition3"></div>
        <div v-else></div>
      </template>
      `,
      errors: [{ message: 'Set "inheritAttrs" to false.' }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1" v-bind="$attrs"></div>
        <div v-else></div>
      </template>
      `,
      errors: [{ message: 'Set "inheritAttrs" to false.' }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="condition1" v-bind="$attrs"></div>
      </template>
      `,
      errors: [{ message: 'Set "inheritAttrs" to false.' }]
    }
  ]
})
