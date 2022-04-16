/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-v-if-else-key')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-v-if-else-key', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional" :key="foo">foo</div>
          <div v-else :key="bar">bar</div>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional" key="foo">foo</div>
          <div v-else key="bar">bar</div>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional">foo</div>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional">foo</div>
          <span v-else>bar</span>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional">foo</div>
          <span v-else-if="conditional">bar</span>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional" key="foo">foo</div>
          <div v-else-if="conditional" key="bar">bar</span>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional" key="one">foo</div>
          <div v-else-if="conditional" key="two">bar</span>
          <div v-else key="three">else</div>
          <div v-if="otherConditional" key="four">baz</div>
          <div v-else-if="otherConditional" key="five">quux</span>
          <div v-else key="six">otherElse</div>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <template v-if="conditional">
            <div>foo</div>
            <div>bar</span>
          </template>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div v-if="conditional">foo</div>
          <template v-else>
            <div>bar</div>
            <div>baz</span>
          </template>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <template v-if="conditional">
            <div>foo</div>
            <div>bar</span>
          </template>
          <template v-else>
            <div>baz</div>
            <div>quux</span>
          </template>
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
        <div v-if="conditional">foo</div>
        <div v-else>bar</div>
      </template>
      `,
      errors: [
        'Elements in v-if/v-else-if/v-else should have distinct keys if they have the same tag name.'
      ]
    }
  ]
})
