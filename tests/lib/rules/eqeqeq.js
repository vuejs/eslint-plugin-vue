/**
 * @author Toru Nagashima
 */
'use strict'

const semver = require('semver')
const { RuleTester, ESLint } = require('../../eslint-compat')
const rule = require('../../../lib/rules/eqeqeq')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('eqeqeq', rule, {
  valid: [
    '<template><div :attr="a === 1" /></template>',
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind(a === 1 ? 'red' : 'blue')
    }
    </style>`
  ],
  invalid: [
    {
      code: '<template><div :attr="a == 1" /></template>',
      errors: [
        {
          message: "Expected '===' and instead saw '=='.",
          suggestions: semver.gte(ESLint.version, '9.26.0')
            ? [
                {
                  desc: "Use '===' instead of '=='.",
                  output: `<template><div :attr="a === 1" /></template>`
                }
              ]
            : null
        }
      ]
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind(a == 1 ? 'red' : 'blue')
      }
      </style>`,
      errors: [
        {
          message: "Expected '===' and instead saw '=='.",
          suggestions: semver.gte(ESLint.version, '9.26.0')
            ? [
                {
                  desc: "Use '===' instead of '=='.",
                  output: `
      <style>
      .text {
        color: v-bind(a === 1 ? 'red' : 'blue')
      }
      </style>`
                }
              ]
            : null
        }
      ]
    }
  ]
})
