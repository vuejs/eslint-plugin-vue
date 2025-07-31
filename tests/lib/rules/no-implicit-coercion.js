/**
 * @author lozinsky <https://github.com/lozinsky>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { RuleTester, ESLint } = require('../../eslint-compat')
const semver = require('semver')
const rule = require('../../../lib/rules/no-implicit-coercion')

/**
 * @param {string} suggestedCode
 * @returns {string}
 */
function getExpectedErrorMessage(suggestedCode) {
  return semver.gte(ESLint.version, '9.0.0')
    ? `Unexpected implicit coercion encountered. Use \`${suggestedCode}\` instead.`
    : `use \`${suggestedCode}\` instead.`
}

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-implicit-coercion', rule, {
  valid: [
    `<template><div :data-foo="Boolean(foo)" /></template>`,
    `<template><div :data-foo="foo.indexOf('.') !== -1" /></template>`,
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="!!foo" /></template>`,
      options: [
        {
          boolean: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="~foo.indexOf('.')" /></template>`,
      options: [
        {
          boolean: false
        }
      ]
    },
    `<template><div :data-foo="Number(foo)" /></template>`,
    ...(semver.gte(ESLint.version, '8.28.0')
      ? [`<template><div :data-foo="foo * 1/4" /></template>`]
      : []),
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="+foo" /></template>`,
      options: [
        {
          number: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="1 * foo" /></template>`,
      options: [
        {
          number: false
        }
      ]
    },
    `<template><div :data-foo="String(foo)" /></template>`,
    `<template><div :data-foo="\`\${foo}\`" /></template>`,
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="'' + foo" /></template>`,
      options: [
        {
          string: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="\`\` + foo" /></template>`,
      options: [
        {
          string: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="!!foo" /></template>`,
      options: [
        {
          allow: ['!!']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="~foo.indexOf('.')" /></template>`,
      options: [
        {
          allow: ['~']
        }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="!!foo" /></template>`,
      output: `<template><div :data-foo="Boolean(foo)" /></template>`,
      errors: [
        {
          message: getExpectedErrorMessage('Boolean(foo)'),
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="~foo.indexOf('.')" /></template>`,
      output: null,
      errors: [
        {
          message: getExpectedErrorMessage("foo.indexOf('.') !== -1"),
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="+foo" /></template>`,
      output: semver.gte(ESLint.version, '9.0.0')
        ? null
        : `<template><div :data-foo="Number(foo)" /></template>`,
      errors: [
        {
          message: getExpectedErrorMessage('Number(foo)'),
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 31,
          suggestions: semver.gte(ESLint.version, '9.0.0')
            ? [
                {
                  messageId: 'useRecommendation',
                  data: { recommendation: 'Number(foo)' },
                  output: '<template><div :data-foo="Number(foo)" /></template>'
                }
              ]
            : []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="1 * foo" /></template>`,
      output: semver.gte(ESLint.version, '9.0.0')
        ? null
        : `<template><div :data-foo="Number(foo)" /></template>`,
      errors: [
        {
          message: getExpectedErrorMessage('Number(foo)'),
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 34,
          suggestions: semver.gte(ESLint.version, '9.0.0')
            ? [
                {
                  messageId: 'useRecommendation',
                  data: { recommendation: 'Number(foo)' },
                  output: '<template><div :data-foo="Number(foo)" /></template>'
                }
              ]
            : []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="'' + foo" /></template>`,
      output: semver.gte(ESLint.version, '9.0.0')
        ? null
        : `<template><div :data-foo="String(foo)" /></template>`,
      errors: [
        {
          message: getExpectedErrorMessage('String(foo)'),
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 35,
          suggestions: semver.gte(ESLint.version, '9.0.0')
            ? [
                {
                  messageId: 'useRecommendation',
                  data: { recommendation: 'String(foo)' },
                  output: '<template><div :data-foo="String(foo)" /></template>'
                }
              ]
            : []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :data-foo="\`\` + foo" /></template>`,
      output: semver.gte(ESLint.version, '9.0.0')
        ? null
        : `<template><div :data-foo="String(foo)" /></template>`,
      errors: [
        {
          message: getExpectedErrorMessage('String(foo)'),
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 35,
          suggestions: semver.gte(ESLint.version, '9.0.0')
            ? [
                {
                  messageId: 'useRecommendation',
                  data: { recommendation: 'String(foo)' },
                  output: '<template><div :data-foo="String(foo)" /></template>'
                }
              ]
            : []
        }
      ]
    },
    ...(semver.gte(ESLint.version, '7.24.0')
      ? [
          {
            filename: 'test.vue',
            code: `<template><div :data-foo="\`\${foo}\`" /></template>`,
            output: semver.gte(ESLint.version, '9.0.0')
              ? null
              : `<template><div :data-foo="String(foo)" /></template>`,
            options: [
              {
                disallowTemplateShorthand: true
              }
            ],
            errors: [
              {
                message: getExpectedErrorMessage('String(foo)'),
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 35,
                suggestions: semver.gte(ESLint.version, '9.0.0')
                  ? [
                      {
                        messageId: 'useRecommendation',
                        data: { recommendation: 'String(foo)' },
                        output:
                          '<template><div :data-foo="String(foo)" /></template>'
                      }
                    ]
                  : []
              }
            ]
          }
        ]
      : [])
  ]
})
