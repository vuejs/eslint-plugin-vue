/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-toggle-inside-transition')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('require-toggle-inside-transition', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div v-if="show" /></transition></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><transition><div v-show="show" /></transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><div v-if="show" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><Transition><div v-show="show" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><MyComp /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><Transition><component :is="component" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><Transition><div :is="component" /></Transition></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><svg height="100" width="100"><transition><circle v-if="show" /></transition></svg> </template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><svg height="100" width="100"><transition><MyComponent /></transition></svg> </template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><transition><template v-if="show"><div /></template></transition></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><transition><div /></transition></template>',
      errors: [
        {
          line: 1,
          column: 23,
          messageId: 'expected',
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><Transition><div /></Transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code: '<template><transition><div /><div /></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code:
        '<template><transition><div v-for="e in list" /></transition></template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code:
        '<template><svg height="100" width="100"><transition><circle /></transition></svg> </template>',
      errors: [{ messageId: 'expected' }]
    },
    {
      filename: 'test.vue',
      code:
        '<template><transition><template v-for="e in list"><div /></template></transition></template>',
      errors: [{ messageId: 'expected' }]
    }
  ]
})
