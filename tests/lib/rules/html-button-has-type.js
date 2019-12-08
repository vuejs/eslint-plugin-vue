/**
 * @fileoverview Prevent usage of button without an explicit type attribute
 * @author Jonathan Santerre
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/html-button-has-type')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({
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
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><button>Hello World</button></template>',
      errors: [{
        message: 'Missing an explicit type attribute for button.'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="">Hello World</button></template>',
      errors: [{
        message: 'A value must be set for button type attribute.'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><button type="foo">Hello World</button></template>',
      errors: [{
        message: 'foo is an invalid value for button type attribute.'
      }]
    },
    {
      filename: 'test.vue',
      options: [{ button: false }],
      code: '<template><button type="button">Hello World</button></template>',
      errors: [{
        message: 'button is a forbidden value for button type attribute.'
      }]
    },
    {
      filename: 'test.vue',
      options: [{ submit: false }],
      code: '<template><button type="submit">Hello World</button></template>',
      errors: [{
        message: 'submit is a forbidden value for button type attribute.'
      }]
    },
    {
      filename: 'test.vue',
      options: [{ reset: false }],
      code: '<template><button type="reset">Hello World</button></template>',
      errors: [{
        message: 'reset is a forbidden value for button type attribute.'
      }]
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
          message: 'button is a forbidden value for button type attribute.'
        },
        {
          message: 'submit is a forbidden value for button type attribute.'
        },
        {
          message: 'reset is a forbidden value for button type attribute.'
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
          message: 'reset is a forbidden value for button type attribute.'
        },
        {
          message: 'A value must be set for button type attribute.'
        },
        {
          message: 'foo is an invalid value for button type attribute.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button>Hello World</button><button>Hello World</button></template>',
      errors: [
        {
          message: 'Missing an explicit type attribute for button.'
        },
        {
          message: 'Missing an explicit type attribute for button.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><button :type="">Hello World</button></template>`,
      errors: [
        {
          message: 'A value must be set for button type attribute.'
        }
      ]
    }
  ]
})
