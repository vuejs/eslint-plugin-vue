/**
 * @author Madogiwa(@madogiwa0124)
 * See LICENSE file in root directory for full license.
 */

'use strict'
const rule = require('../../../lib/rules/no-deprecated-vue-extend')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-deprecated-vue-config-keycodes', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `const Profile = {}`
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          import { defineComponent } from 'vue'
          export default defineComponent({})
        </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.js',
      code: `const Profile = Vue.extend({})`,
      errors: [
        {
          message: '`Vue.extend` are deprecated.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          import Vue from 'vue'
          export default Vue.extend({})
        </script>
      `,
      errors: [
        {
          message: '`Vue.extend` are deprecated.'
        }
      ]
    }
  ]
})
