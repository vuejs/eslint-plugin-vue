/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('style-css-vars-injection', '^3.0.3')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})

tester.run('no-unsupported-features/style-css-vars-injection', rule, {
  valid: [
    {
      code: `
      <template>
        <div class="text">hello</div>
      </template>

      <script>
        export default {
          data() {
            return {
              color: 'red',
              font: {
                size: '2em',
              },
            }
          },
        }
      </script>

      <style>
        .text {
          color: v-bind(color);

          /* expressions (wrap in quotes) */
          font-size: v-bind('font.size');
        }
      </style>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <div class="text">hello</div>
      </template>

      <script>
      </script>

      <style>
        .text {
          color: red;
          font-size: 2em;
        }
      </style>`,
      options: buildOptions({ version: '^2.6.0' })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div class="text">hello</div>
      </template>

      <script>
        export default {
          data() {
            return {
              color: 'red',
              font: {
                size: '2em',
              },
            }
          },
        }
      </script>

      <style>
        .text {
          color: v-bind(color);

          /* expressions (wrap in quotes) */
          font-size: v-bind('font.size');
        }
      </style>`,
      options: buildOptions({ version: '^3.0.0' }),
      errors: [
        {
          message:
            'SFC CSS variable injection is not supported until Vue.js "3.0.3".',
          line: 21,
          column: 18,
          endLine: 21,
          endColumn: 31
        },
        {
          message:
            'SFC CSS variable injection is not supported until Vue.js "3.0.3".',
          line: 24,
          column: 22,
          endLine: 24,
          endColumn: 41
        }
      ]
    }
  ]
})
