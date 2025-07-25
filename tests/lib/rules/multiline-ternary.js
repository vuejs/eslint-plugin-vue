/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/multiline-ternary')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('multiline-ternary', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="{
          'test': someReallyLongCondition ?
            aVeryLongOutput :
            thisCantFitOnASingleLine
        }">
        </div>
      </template>
      `
    },
    {
      // doesn't check ternary statements in <script> block
      filename: 'test.vue',
      code: `
      <script>
        let test = someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="{
          'test': someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
        }">
        </div>
      </template>
      `,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
          <div class="test">
          </div>
      </template>
      <style>
        .test {
            color: v-bind('someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine')
        }
      </style>
      `,
      options: ['never']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div :class="{
            'test': someReallyLongCondition ?
              aVeryLongOutput : thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      output: `
        <template>
          <div :class="{
            'test': someReallyLongCondition ?
              aVeryLongOutput
: thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      options: ['always-multiline'],
      errors: [
        {
          message:
            'Expected newline between consequent and alternate of ternary expression.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div :class="{
            'test': someReallyLongCondition ?
              aVeryLongOutput : thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      output: `
        <template>
          <div :class="{
            'test': someReallyLongCondition ?aVeryLongOutput : thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      options: ['never'],
      errors: [
        {
          message:
            'Unexpected newline between test and consequent of ternary expression.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div :class="{
            'test': someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      output: `
        <template>
          <div :class="{
            'test': someReallyLongCondition
? aVeryLongOutput
: thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      errors: [
        {
          message:
            'Expected newline between test and consequent of ternary expression.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 44
        },
        {
          message:
            'Expected newline between consequent and alternate of ternary expression.',
          line: 4,
          column: 47,
          endLine: 4,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div :style="{
            'test': someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      output: `
        <template>
          <div :style="{
            'test': someReallyLongCondition
? aVeryLongOutput
: thisCantFitOnASingleLine
          }">
          </div>
        </template>
        `,
      errors: [
        {
          message:
            'Expected newline between test and consequent of ternary expression.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 44
        },
        {
          message:
            'Expected newline between consequent and alternate of ternary expression.',
          line: 4,
          column: 47,
          endLine: 4,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div class="test">
          </div>
        </template>
        <style>
          .test {
              color: v-bind('someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine')
          }
        </style>
        `,
      output: `
        <template>
          <div class="test">
          </div>
        </template>
        <style>
          .test {
              color: v-bind('someReallyLongCondition
? aVeryLongOutput
: thisCantFitOnASingleLine')
          }
        </style>
        `,
      errors: [
        {
          message:
            'Expected newline between test and consequent of ternary expression.',
          line: 8,
          column: 30,
          endLine: 8,
          endColumn: 53
        },
        {
          message:
            'Expected newline between consequent and alternate of ternary expression.',
          line: 8,
          column: 56,
          endLine: 8,
          endColumn: 71
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="{
          'test': someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
        }">
        </div>
      </template>
      <script>
        let test = someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
      </script>
      `,
      output: `
      <template>
        <div :class="{
          'test': someReallyLongCondition
? aVeryLongOutput
: thisCantFitOnASingleLine
        }">
        </div>
      </template>
      <script>
        let test = someReallyLongCondition ? aVeryLongOutput : thisCantFitOnASingleLine
      </script>
      `,
      errors: [
        {
          message:
            'Expected newline between test and consequent of ternary expression.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 42
        },
        {
          message:
            'Expected newline between consequent and alternate of ternary expression.',
          line: 4,
          column: 45,
          endLine: 4,
          endColumn: 60
        }
      ]
    }
  ]
})
