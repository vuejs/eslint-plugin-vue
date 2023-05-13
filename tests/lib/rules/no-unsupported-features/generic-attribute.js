/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('generic-attribute', '^3.2.0')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})

tester.run('no-unsupported-features/generic-attribute', rule, {
  valid: [
    {
      code: `
      <script setup lang="ts" generic="T">
      const props = defineProps({ foo: T })
      </script>
      `,
      options: buildOptions({ version: '^3.2.0' })
    },
    {
      code: `
      <script setup lang="ts">
      type T = number
      const props = defineProps({ foo: T })
      </script>
      `,
      options: buildOptions()
    },
    {
      code: `
      <script setup lang="ts" generic="T">
      const props = defineProps({ foo: T })
      </script>
      `,
      options: buildOptions({
        version: '^3.2.0',
        ignores: ['generic-attribute']
      })
    }
  ],
  invalid: [
    {
      code: `
      <script setup lang="ts" generic="T">
      const props = defineProps({ foo: T })
      </script>
      `,
      options: buildOptions(),
      errors: [
        {
          message: '`generic` attribute is not supported until Vue.js "3.3.0".',
          line: 2
        }
      ]
    }
  ]
})
