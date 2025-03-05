/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/prefer-true-attribute-shorthand')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input :value="true" :foo-bar="true" />
      </template>
      `,
      options: ['always', { except: ['value', '/^foo-/'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input value foo-bar />
      </template>
      `,
      options: ['never', { except: ['value', '/^foo-/'] }]
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
              messageId: 'rewriteIntoLongVueProp',
              output: `
      <template>
        <MyComp :show="true" />
      </template>`
            },
            {
              messageId: 'rewriteIntoLongHtmlAttr',
              output: `
      <template>
        <MyComp show="show" />
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
        <MyComp value foo-bar />
      </template>`,
      output: null,
      options: ['always', { except: ['value', '/^foo-/'] }],
      errors: [
        {
          messageId: 'expectLong',
          line: 3,
          column: 17,
          suggestions: [
            {
              messageId: 'rewriteIntoLongVueProp',
              output: `
      <template>
        <MyComp :value="true" foo-bar />
      </template>`
            },
            {
              messageId: 'rewriteIntoLongHtmlAttr',
              output: `
      <template>
        <MyComp value="value" foo-bar />
      </template>`
            }
          ]
        },
        {
          messageId: 'expectLong',
          line: 3,
          column: 23,
          suggestions: [
            {
              messageId: 'rewriteIntoLongVueProp',
              output: `
      <template>
        <MyComp value :foo-bar="true" />
      </template>`
            },
            {
              messageId: 'rewriteIntoLongHtmlAttr',
              output: `
      <template>
        <MyComp value foo-bar="foo-bar" />
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
        <MyComp :value="true" :foo-bar="true" />
      </template>`,
      output: null,
      options: ['never', { except: ['value', '/^foo-/'] }],
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
        <MyComp value :foo-bar="true" />
      </template>`
            }
          ]
        },
        {
          messageId: 'expectShort',
          line: 3,
          column: 31,
          suggestions: [
            {
              messageId: 'rewriteIntoShort',
              output: `
      <template>
        <MyComp :value="true" foo-bar />
      </template>`
            }
          ]
        }
      ]
    }
  ]
})
