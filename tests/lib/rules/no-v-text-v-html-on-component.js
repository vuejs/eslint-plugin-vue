/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-v-text-v-html-on-component')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-v-text-v-html-on-component', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-text="content" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-html="content" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComponent v-if="content" />
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComponent v-text="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComponent v-html="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is="component" v-text="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is="component" v-html="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :is="component" v-text="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :is="component" v-html="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 30
        }
      ]
    }
  ]
})
