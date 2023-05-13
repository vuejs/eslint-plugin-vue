/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('define-options', '^3.2.0')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/define-options', rule, {
  valid: [
    {
      code: `
      <script setup>
        defineOptions({})
      </script>`,
      options: buildOptions({ version: '^3.3.0' })
    },
    {
      code: `
      <script setup>
        defineProps({})
      </script>`,
      options: buildOptions()
    },
    {
      code: `
      <script setup>
        defineOptions({})
      </script>`,
      options: buildOptions({ version: '^3.0.0', ignores: ['define-options'] })
    }
  ],
  invalid: [
    {
      code: `
      <script setup>
        defineOptions({})
      </script>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`defineOptions()` macros are not supported until Vue.js "3.3.0".',
          line: 3
        }
      ]
    }
  ]
})
