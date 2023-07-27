/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-true-attribute-shorthand')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-true-attribute-shorthand', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-if="true" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-bind="true" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-loading="true" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp show="true" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-bind:show="value" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp :show="value" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-bind:show="false" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp :show="false" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp show />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp show />
      </template>
      `,
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp :show="true" />
      </template>
      `,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-bind:show="true" />
      </template>
      `,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input v-bind:checked="true" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input :checked="true" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input checked="checked" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input checked />
      </template>
      `,
      options: ['never']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-bind:show="true" />
      </template>`,
      output: null,
      errors: [
        {
          messageId: 'expectShort',
          line: 3,
          column: 17,
          suggestions: [
            {
              messageId: 'rewriteIntoShort',
              output: `
      <template>
        <MyComp show />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp :show="true" />
      </template>`,
      output: null,
      errors: [
        {
          messageId: 'expectShort',
          line: 3,
          column: 17,
          suggestions: [
            {
              messageId: 'rewriteIntoShort',
              output: `
      <template>
        <MyComp show />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp v-bind:show="true" />
      </template>`,
      output: null,
      options: ['always'],
      errors: [
        {
          messageId: 'expectShort',
          line: 3,
          column: 17,
          suggestions: [
            {
              messageId: 'rewriteIntoShort',
              output: `
      <template>
        <MyComp show />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp :show="true" />
      </template>`,
      output: null,
      options: ['always'],
      errors: [
        {
          messageId: 'expectShort',
          line: 3,
          column: 17,
          suggestions: [
            {
              messageId: 'rewriteIntoShort',
              output: `
      <template>
        <MyComp show />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComp show />
      </template>`,
      output: null,
      options: ['never'],
      errors: [
        {
          messageId: 'expectLong',
          line: 3,
          column: 17,
          suggestions: [
            {
              output: `
      <template>
        <MyComp :show="true" />
      </template>`
            },
            {
              output: `
      <template>
        <MyComp show="show" />
      </template>`
            }
          ]
        }
      ]
    }
  ]
})
