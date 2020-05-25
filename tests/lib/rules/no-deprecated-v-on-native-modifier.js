/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-v-on-native-modifier')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-v-on-native-modifier', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.enter='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.enter='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-native:foo.native.foo.bar='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @native.enter='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input :keydown.native='fire'></template>"
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.native='fore'></template>",
      errors: [
        {
          line: 1,
          column: 29,
          messageId: 'deprecated',
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.foo.native.bar='fore'></template>",
      errors: [
        {
          line: 1,
          column: 33,
          messageId: 'deprecated',
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
})
