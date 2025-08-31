/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { RuleTester, ESLint } = require('../../eslint-compat')
const semver = require('semver')
const rule = require('../../../lib/rules/no-loss-of-precision')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
tester.run('no-loss-of-precision', rule, {
  valid: [
    ...(semver.gte(ESLint.version, '7.1.0')
      ? [
          {
            filename: 'test.vue',
            code: `
            <template>
              {{12345}}
              {{123.45}}
            </template>
            `
          },
          {
            filename: 'test.vue',
            code: `
            <template>
              <MyComponent num="12345678901234567890" />
            </template>
            `
          }
        ]
      : [])
  ],
  invalid: [
    ...(semver.gte(ESLint.version, '7.1.0')
      ? [
          {
            filename: 'test.vue',
            code: `
            <template>
              {{12345678901234567890}}
              {{0.12345678901234567890}}
            </template>
            `,
            errors: [
              {
                message: 'This number literal will lose precision at runtime.',
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 37
              },
              {
                message: 'This number literal will lose precision at runtime.',
                line: 4,
                column: 17,
                endLine: 4,
                endColumn: 39
              }
            ]
          },
          {
            filename: 'test.vue',
            code: `
            <template>
              <MyComponent :num="12345678901234567890" />
            </template>
            `,
            errors: [
              {
                message: 'This number literal will lose precision at runtime.',
                line: 3,
                column: 34,
                endLine: 3,
                endColumn: 54
              }
            ]
          }
        ]
      : [
          {
            filename: 'test.vue',
            code: `
            <template>
              <MyComponent :num="12345678901234567890" />
            </template>
            `,
            errors: [
              'Failed to extend ESLint core rule "no-loss-of-precision". You may be able to use this rule by upgrading the version of ESLint. If you cannot upgrade it, turn off this rule.'
            ]
          }
        ])
  ]
})
