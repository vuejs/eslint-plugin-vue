/**
 * @fileoverview disallow usage of mustache interpolations.
 * @author james2doyle
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-mustache')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-mustache', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text="text"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-html="text"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :data-label="text"></div></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div>{{ text }}</div></template>',
      output: '<template><div>{{ text }}</div></template>',
      errors: [
        "Expected text content to be in 'v-text' or 'v-html' but found mustache template."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div data-label="{{ text }}"></div></template>',
      output: '<template><div data-label="{{ text }}"></div></template>',
      errors: ['Expected attribute be a binding but found mustache template.']
    }
  ]
})
