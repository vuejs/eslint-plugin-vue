/**
 * @author Nhan Nguyen
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/quotes')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('quotes', rule, {
  valid: [
    `<template>
      <div>{{ "hello" }}</div>
    </template>`,
    `<template>
      <div>'This string contains "single" quotes'</div>
    </template>`,
    {
      code: `
        <template>
          <div>{{ 'hello' }}</div>
        </template>`,
      options: ['single']
    },
    {
      code: `
        <template>
          <div>{{ \`hello\` }}</div>
        </template>`,
      options: ['backtick']
    },
    {
      code: `
        <template>
          <div>"This string contains 'single' quotes"</div>
        </template>`,
      options: ['single', { avoidEscape: true }]
    },
    {
      code: `
        <template>
          <div>'This string contains "double" quotes'</div>
        </template>`,
      options: ['double', { avoidEscape: true }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div>{{ 'hello' }}</div>
      </template>
      `,
      output: `
      <template>
        <div>{{ "hello" }}</div>
      </template>
      `,
      errors: [
        {
          message: 'Strings must use doublequote.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div>{{ "hello" }}</div>
      </template>
      `,
      output: `
      <template>
        <div>{{ 'hello' }}</div>
      </template>
      `,
      options: ['single'],
      errors: [
        {
          message: 'Strings must use singlequote.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div>{{ 'hello' }}</div>
      </template>
      `,
      output: `
      <template>
        <div>{{ \`hello\` }}</div>
      </template>
      `,
      options: ['backtick'],
      errors: [
        {
          message: 'Strings must use backtick.',
          line: 3
        }
      ]
    }
  ]
})
