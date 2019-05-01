/**
 * @fileoverview enforce ordering of classes
 * @author Maciej Chmurski
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/class-order')
var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})
tester.run('class-order', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div class="a b"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div class="a"></div></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div class="b a"></div></template>',
      output: '<template><div class="a b"></div></template>',
      errors: [{
        message: 'Classes should be ordered alphabetically.',
        type: 'VAttribute'
      }]
    },
    {
      filename: 'test.vue',
      code:
        `<template>
          <div class="c b a">
          </div>
        </template>`,
      output:
        `<template>
          <div class="a b c">
          </div>
        </template>`,
      errors: [
        {
          message: 'Classes should be ordered alphabetically.',
          type: 'VAttribute'
        }
      ]
    }
  ]
})
