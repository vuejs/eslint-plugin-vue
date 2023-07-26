/**
 * @author Doug Wade
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-html-elements')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-restricted-html-elements', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
      options: ['button']
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>',
      options: ['button']
    },
    {
      filename: 'test.vue',
      code: '<template><button type="button"></button></template>',
      options: ['div']
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"><Button type="button"></Button></div></template>',
      options: ['button']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><button type="button"></button><div></template>',
      options: ['button'],
      errors: [
        {
          message: 'Unexpected use of forbidden HTML element button.',
          line: 1,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"><button type="button"></button></div></template>',
      options: ['div'],
      errors: [
        {
          message: 'Unexpected use of forbidden HTML element div.',
          line: 1,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><marquee>foo</marquee></template>',
      options: [{ element: 'marquee', message: 'Custom error' }],
      errors: [
        {
          message: 'Custom error',
          line: 1,
          column: 11
        }
      ]
    }
  ]
})
