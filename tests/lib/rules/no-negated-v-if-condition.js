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
        <div v-if="!foo" class="primary">Content</div>
        <span v-else class="secondary">Alternative</span>
      </template>
      `,
      output: `
      <template>
        <span v-if="foo" class="secondary">Alternative</span>
        <div v-else class="primary">Content</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!(foo && bar)" id="negated">Negated condition</div>
        <span v-else id="positive">Otherwise</span>
      </template>
      `,
      output: `
      <template>
        <span v-if="(foo && bar)" id="positive">Otherwise</span>
        <div v-else id="negated">Negated condition</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 33
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
      output: `
      <template>
        <div v-if="a == b">Equal</div>
        <div v-else>Not equal</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 26
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
      output: `
      <template>
        <div v-if="a === b">Strictly equal</div>
        <div v-else>Strictly not equal</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" class="first">First</div>
        <span v-else-if="!bar" class="second">Second</span>
        <p v-else class="default">Default</p>
      </template>
      `,
      output: `
      <template>
        <div v-if="foo" class="first">First</div>
        <p v-else-if="bar" class="default">Default</p>
        <span v-else class="second">Second</span>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!a" data-first>First</div>
        <span v-else-if="!b" data-second>Second</span>
        <p v-else data-default>Default</p>
      </template>
      `,
      output: `
      <template>
        <div v-if="!a" data-first>First</div>
        <p v-else-if="b" data-default>Default</p>
        <span v-else data-second>Second</span>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!condition" class="div-class" div-attr="foo" div-attr-2 :div-attr-3="foo">div contents</div>
        <span v-else class="span-class" span-attr="baz" span-attr2 :span-attr-3="baz">span contents</span>
      </template>
      `,
      output: `
      <template>
        <span v-if="condition" class="span-class" span-attr="baz" span-attr2 :span-attr-3="baz">span contents</span>
        <div v-else class="div-class" div-attr="foo" div-attr-2 :div-attr-3="foo">div contents</div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!outer" class="outer-if">
          <span v-if="!inner" class="inner-if">Inner if content</span>
          <p v-else class="inner-else">Inner else content</p>
        </div>
        <section v-else class="outer-else">
          <span v-if="!nested" class="nested-if">Nested if content</span>
          <p v-else class="nested-else">Nested else content</p>
        </section>
      </template>
      `,
      output: `
      <template>
        <section v-if="outer" class="outer-else">
          <span v-if="!nested" class="nested-if">Nested if content</span>
          <p v-else class="nested-else">Nested else content</p>
        </section>
        <div v-else class="outer-if">
          <span v-if="!inner" class="inner-if">Inner if content</span>
          <p v-else class="inner-else">Inner else content</p>
        </div>
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 26
        },
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 29
        },
        {
          messageId: 'negatedCondition',
          line: 8,
          column: 23,
          endLine: 8,
          endColumn: 30
        }
      ]
    }
  ]
})
