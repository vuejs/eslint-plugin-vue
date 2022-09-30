/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { RuleTester, ESLint } = require('../../eslint-compat')
const rule = require('../../../lib/rules/multiline-ternary')
const semver = require('semver')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
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
    }
  ],
  invalid: [
    ...(semver.gte(ESLint.version, '7.1.0')
      ? [
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
            errors: [
              {
                message:
                  'Expected newline between consequent and alternate of ternary expression.',
                line: 5,
                column: 13
              }
            ],
            options: ['always-multiline']
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
            errors: [
              {
                message:
                  'Unexpected newline between test and consequent of ternary expression.',
                line: 4,
                column: 19
              }
            ],
            options: ['never']
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
                column: 19
              },
              {
                message:
                  'Expected newline between consequent and alternate of ternary expression.',
                line: 4,
                column: 45
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
                column: 19
              },
              {
                message:
                  'Expected newline between consequent and alternate of ternary expression.',
                line: 4,
                column: 45
              }
            ]
          }
        ]
      : [
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
            errors: [
              {
                message:
                  'Expected newline between consequent and alternate of ternary expression.',
                line: 5,
                column: 15
              }
            ],
            options: ['always-multiline']
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
            errors: [
              {
                message:
                  'Unexpected newline between test and consequent of ternary expression.',
                line: 4,
                column: 21
              }
            ],
            options: ['never']
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
            errors: [
              {
                message:
                  'Expected newline between test and consequent of ternary expression.',
                line: 4,
                column: 21
              },
              {
                message:
                  'Expected newline between consequent and alternate of ternary expression.',
                line: 4,
                column: 45
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
            errors: [
              {
                message:
                  'Expected newline between test and consequent of ternary expression.',
                line: 4,
                column: 21
              },
              {
                message:
                  'Expected newline between consequent and alternate of ternary expression.',
                line: 4,
                column: 45
              }
            ]
          }
        ])
  ]
})
