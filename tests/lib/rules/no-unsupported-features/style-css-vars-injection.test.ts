/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../../eslint-compat.ts'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'
import vueEslintParser from 'vue-eslint-parser'

const buildOptions = optionsBuilder('style-css-vars-injection', '^3.0.3')
const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
      options: buildOptions({ version: '^2.7.0' })
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
            'SFC CSS variable injection is not supported until Vue.js ">=3.0.3 || >=2.7.0 <3.0.0".',
          line: 21,
          column: 18,
          endLine: 21,
          endColumn: 31
        },
        {
          message:
            'SFC CSS variable injection is not supported until Vue.js ">=3.0.3 || >=2.7.0 <3.0.0".',
          line: 24,
          column: 22,
          endLine: 24,
          endColumn: 41
        }
      ]
    }
  ]
})
