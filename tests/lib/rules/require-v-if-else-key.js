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
        'Elements in v-if/v-else-if/v-else expect to have distinct keys if they are of the same type.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="conditional" key="foo">foo</div>
        <div v-else key="foo">bar</div>
      </template>
      `,
      errors: [
        'Elements in v-if/v-else-if/v-else expect to have distinct keys if they are of the same type.'
      ]
    }
  ]
})
