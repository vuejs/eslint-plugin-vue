/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-closing-bracket-newline')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('html-closing-bracket-newline', rule, {
  valid: [
    `<template><div></div></template>`,
    `
      <template>
        <div
          id=""
        >
        </div>
      </template>
    `,
    {
      code: `<template><div></div></template>`,
      options: [{
        singleline: 'never',
        multiline: 'never'
      }]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'never'
      }]
    },
    {
      code: `
        <template>
          <div
            id=""
            >
          </div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'always'
      }]
    },
    {
      code: `
        <template>
          <div id="">
          </div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'always'
      }]
    },
    {
      code: `
        <template
        >
          <div
            id="">
          </div
          >
        </template
        >
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }]
    },
    {
      code: `
        <template
        >
          <div id=""
          >
          </div
          >
        </template
        >
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }]
    },

    // Ignore if no closing brackets
    `
      <template>
        <div
          id=
          ""
    `
  ],
  invalid: [
    {
      code: `
        <template>
          <div
          ></div

          >
        </template>
      `,
      output: `
        <template>
          <div></div>
        </template>
      `,
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected no line breaks before closing bracket, but 2 line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id=""
>
          </div>
        </template>
      `,
      errors: [
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
          ></div

          >
        </template>
      `,
      output: `
        <template>
          <div></div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'never'
      }],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected no line breaks before closing bracket, but 2 line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
            id=""
            >
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'never'
      }],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.'
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id=""
>
          </div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'always'
      }],
      errors: [
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div id=""
          >
          </div
          >
        </template>
      `,
      output: `
        <template>
          <div id="">
          </div>
        </template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'always'
      }],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected no line breaks before closing bracket, but 1 line break found.'
      ]
    },
    {
      code: `
        <template
        >
          <div
            id=""
            >
          </div>
        </template
        >
      `,
      output: `
        <template
        >
          <div
            id="">
          </div
>
        </template
        >
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template
        >
          <div id="">
          </div>
        </template
        >
      `,
      output: `
        <template
        >
          <div id=""
>
          </div
>
        </template
        >
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }],
      errors: [
        'Expected 1 line break before closing bracket, but no line breaks found.',
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    }
  ]
})
