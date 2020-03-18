/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/new-line-between-multi-line-property')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('new-line-between-multi-line-property', rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },
          
          label: String,
          icon: String
        }
      }
      </script>
      `,
      errors: [
        'Enforce new lines between multi-line properties in Vue components.'
      ]
    }
  ]
})
