/**
 * @fileoverview Prevent usage of button without an explicit type attribute
 * @author Jonathan Santerre
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-button-has-type')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
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
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="">Hello World</button></template>',
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type>Hello World</button></template>',
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="foo">Hello World</button></template>',
      errors: [
        {
          message: 'foo is an invalid value for button type attribute.',
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [{ button: false }],
      code: '<template><button type="button">Hello World</button></template>',
      errors: [
        {
          message: 'button is a forbidden value for button type attribute.',
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [{ submit: false }],
      code: '<template><button type="submit">Hello World</button></template>',
      errors: [
        {
          message: 'submit is a forbidden value for button type attribute.',
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [{ reset: false }],
      code: '<template><button type="reset">Hello World</button></template>',
      errors: [
        {
          message: 'reset is a forbidden value for button type attribute.',
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [{ button: false, submit: false, reset: false }],
      code: `<template>
                <button type="button">Hello World</button>
                <button type="submit">Hello World</button>
                <button type="reset">Hello World</button>
             </template>`,
      errors: [
        {
          message: 'button is a forbidden value for button type attribute.',
          line: 2,
          column: 30
        },
        {
          message: 'submit is a forbidden value for button type attribute.',
          line: 3,
          column: 30
        },
        {
          message: 'reset is a forbidden value for button type attribute.',
          line: 4,
          column: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [{ button: true, submit: true, reset: false }],
      code: `<template>
                <button type="button">Hello World</button>
                <button type="submit">Hello World</button>
                <button type="reset">Hello World</button>
                <button type="">Hello World</button>
                <button type="foo">Hello World</button>
             </template>`,
      errors: [
        {
          message: 'reset is a forbidden value for button type attribute.',
          line: 4,
          column: 30
        },
        {
          message: 'A value must be set for button type attribute.',
          line: 5,
          column: 30
        },
        {
          message: 'foo is an invalid value for button type attribute.',
          line: 6,
          column: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button>Hello World</button><button>Hello World</button></template>',
      errors: [
        {
          message: 'Missing an explicit type attribute for button.',
          column: 11
        },
        {
          message: 'Missing an explicit type attribute for button.',
          column: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><button :type="">Hello World</button></template>`,
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><button v-bind:type>Hello World</button></template>`,
      errors: [
        {
          message: 'A value must be set for button type attribute.',
          column: 19
        }
      ]
    }
  ]
})
