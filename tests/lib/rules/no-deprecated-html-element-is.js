/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-html-element-is')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2019 }
})

ruleTester.run('no-deprecated-html-element-is', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><component is="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Foo is="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><component :is="\'foo\'" /></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div is="foo" /></template>',
      errors: [
        {
          line: 1,
          column: 16,
          messageId: 'unexpected',
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :is="foo" /></template>',
      errors: [
        {
          line: 1,
          column: 16,
          messageId: 'unexpected'
        }
      ]
    }
  ]
})
