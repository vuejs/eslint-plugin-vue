/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('script-setup', '^3.0.0')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/script-setup', rule, {
  valid: [
    {
      code: `
      <script setup>
      </script>`,
      options: buildOptions()
    },
    {
      code: `
      <script setup>
      </script>`,
      options: buildOptions({ version: '^2.7.0' })
    },
    {
      code: `
      <script>
      </script>`,
      options: buildOptions({ version: '^2.6.0' })
    }
  ],
  invalid: [
    {
      code: `
      <script setup>
      </script>`,
      options: buildOptions({ version: '^2.6.0' }),
      errors: [
        {
          message: '`<script setup>` is not supported until Vue.js "2.7.0".',
          line: 2
        }
      ]
    }
  ]
})
