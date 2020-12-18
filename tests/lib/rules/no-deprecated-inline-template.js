/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-inline-template')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2019 }
})

ruleTester.run('no-deprecated-inline-template', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><my-component><div /></my-component></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div /></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><my-component :inline-template="foo"><div /></my-component></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><my-component Inline-Template="foo"><div /></my-component></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code:
        '<template><my-component inline-template><div /></my-component></template>',
      errors: [
        {
          line: 1,
          column: 25,
          messageId: 'unexpected',
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><my-component inline-template=""><div /></my-component></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      filename: 'test.vue',
      code:
        '<template><my-component inline-template="foo"><div /></my-component></template>',
      errors: [{ messageId: 'unexpected' }]
    }
  ]
})
