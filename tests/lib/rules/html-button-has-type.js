/**
 * @fileoverview Prevent usage of button without an explicit type attribute
 * @author Jonathan Santerre
 */
'use strict'

const rule = require('../../../lib/rules/html-button-has-type')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})
ruleTester.run('html-button-has-type', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><button type="button">Hello World</button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button type="submit">Hello World</button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button type="reset">Hello World</button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><slot><button type="button">Hello World</button></slot></template>'
    },
    {
      filename: 'test.vue',
      code: `<template>
                <button type="button">Hello World</button>
                <button type="submit">Hello World</button>
                <button type="reset">Hello World</button>
             </template>`
    },
    {
      filename: 'test.vue',
      code: `<template><button :type="buttonType">Hello World</button></template>`
    },
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template><Button>Hello World</Button></template>`
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><button>Hello World</button></template>',
      errors: [
        {
          message: 'Missing an explicit type attribute for button.',
          column: 11,
          line: 1,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="">Hello World</button></template>',
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 24,
          line: 1,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type>Hello World</button></template>',
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 19,
          line: 1,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="foo">Hello World</button></template>',
      errors: [
        {
          message: 'foo is an invalid value for button type attribute.',
          column: 24,
          line: 1,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="button">Hello World</button></template>',
      options: [{ button: false }],
      errors: [
        {
          message: 'button is a forbidden value for button type attribute.',
          column: 24,
          line: 1,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="submit">Hello World</button></template>',
      options: [{ submit: false }],
      errors: [
        {
          message: 'submit is a forbidden value for button type attribute.',
          column: 24,
          line: 1,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="reset">Hello World</button></template>',
      options: [{ reset: false }],
      errors: [
        {
          message: 'reset is a forbidden value for button type attribute.',
          column: 24,
          line: 1,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
                <button type="button">Hello World</button>
                <button type="submit">Hello World</button>
                <button type="reset">Hello World</button>
             </template>`,
      options: [{ button: false, submit: false, reset: false }],
      errors: [
        {
          message: 'button is a forbidden value for button type attribute.',
          line: 2,
          column: 30,
          endLine: 2,
          endColumn: 38
        },
        {
          message: 'submit is a forbidden value for button type attribute.',
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 38
        },
        {
          message: 'reset is a forbidden value for button type attribute.',
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
                <button type="button">Hello World</button>
                <button type="submit">Hello World</button>
                <button type="reset">Hello World</button>
                <button type="">Hello World</button>
                <button type="foo">Hello World</button>
             </template>`,
      options: [{ button: true, submit: true, reset: false }],
      errors: [
        {
          message: 'reset is a forbidden value for button type attribute.',
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 37
        },
        {
          message: 'A value must be set for button type attribute.',
          line: 5,
          column: 30,
          endLine: 5,
          endColumn: 32
        },
        {
          message: 'foo is an invalid value for button type attribute.',
          line: 6,
          column: 30,
          endLine: 6,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button>Hello World</button><button>Hello World</button></template>',
      errors: [
        {
          message: 'Missing an explicit type attribute for button.',
          column: 11,
          line: 1,
          endLine: 1,
          endColumn: 19
        },
        {
          message: 'Missing an explicit type attribute for button.',
          column: 39,
          line: 1,
          endLine: 1,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><button :type="">Hello World</button></template>`,
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 25,
          line: 1,
          endLine: 1,
          endColumn: 27
        }
      ]
    }
  ]
})
