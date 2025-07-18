/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-negated-v-if-condition')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-negated-v-if-condition', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo">Content</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo">First</div>
        <div v-if="bar">Second</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo">Content</div>
        <div v-else-if="bar">Alternative</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo">First</div>
        <div v-else-if="!bar">Second</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a != b">Not equal</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a !== b">Strictly not equal</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a != b">Not equal</div>
        <div v-else-if="c">Alternative</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a !== b">Strictly not equal</div>
        <div v-else-if="c">Alternative</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo">First</div>
        <div v-else-if="!bar">Second</div>
        <div v-else-if="baz">Third</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!a">First</div>
        <div v-else-if="b">Second</div>
        <div v-else>Default</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo">Positive</div>
        <div v-else>Negative</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo">First</div>
        <div v-else-if="bar">Second</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo && bar">Both true</div>
        <div v-else>Otherwise</div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo">
          <span v-if="!bar">Nested content</span>
        </div>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo">Content</div>
        <div v-else>Alternative</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 24,
          suggestions: [
            {
              messageId: 'fixNegatedCondition',
              output: `
      <template>
        <div v-if="foo">Alternative</div>
        <div v-else>Content</div>
      </template>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!(foo && bar)">Negated condition</div>
        <div v-else>Otherwise</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              messageId: 'fixNegatedCondition',
              output: `
      <template>
        <div v-if="(foo && bar)">Otherwise</div>
        <div v-else>Negated condition</div>
      </template>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a != b">Not equal</div>
        <div v-else>Equal</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 26,
          suggestions: [
            {
              messageId: 'fixNegatedCondition',
              output: `
      <template>
        <div v-if="a == b">Equal</div>
        <div v-else>Not equal</div>
      </template>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a !== b">Strictly not equal</div>
        <div v-else>Strictly equal</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 27,
          suggestions: [
            {
              messageId: 'fixNegatedCondition',
              output: `
      <template>
        <div v-if="a === b">Strictly equal</div>
        <div v-else>Strictly not equal</div>
      </template>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo">First</div>
        <div v-else-if="!bar">Second</div>
        <div v-else>Default</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 29,
          suggestions: [
            {
              messageId: 'fixNegatedCondition',
              output: `
      <template>
        <div v-if="foo">First</div>
        <div v-else-if="bar">Default</div>
        <div v-else>Second</div>
      </template>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!a">First</div>
        <div v-else-if="!b">Second</div>
        <div v-else>Default</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27,
          suggestions: [
            {
              messageId: 'fixNegatedCondition',
              output: `
      <template>
        <div v-if="!a">First</div>
        <div v-else-if="b">Default</div>
        <div v-else>Second</div>
      </template>
      `
            }
          ]
        }
      ]
    }
  ]
})
