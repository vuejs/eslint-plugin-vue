/**
 * @fileoverview Disallow variable declarations from shadowing variables declared in the outer scope.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-template-shadow')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

ruleTester.run('no-template-shadow', rule, {

  valid: [
    '',
    '<template><div></div></template>',
    '<template><div v-for="i in 5"></div></template>',
    '<template><div v-for="i in 5"><div v-for="b in 5"></div></div></template>',
    '<template><div v-for="i in 5"></div><div v-for="i in 5"></div></template>',
    '<template> <ul v-for="i in 5"> <li> <span v-for="j in 10">{{i}},{{j}}</span> </li> </ul> </template>',
    {
      filename: 'test.vue',
      code: `<template>
        <div v-for="i in 5"></div>
        <div v-for="i in 5"></div>
      </template>
      <script>
        export default {
          computed: {
            f () { }
          }
        }
      </script>`
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-for="i in 5"><div v-for="i in 5"></div></div></template>',
      errors: [{
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier'
      }]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div v-for="i in 5">
          <div v-for="i in 5"></div>
        </div>
      </template>
      <script>
        export default {
          data: {
            i: 7
          }
        }
      </script>`,
      errors: [{
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier'
      }, {
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier'
      }]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div v-for="i in 5"></div>
        <div v-for="i in 5"></div>
      </template>
      <script>
        export default {
          data: {
            i: 7
          }
        }
      </script>`,
      errors: [{
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier'
      }, {
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier'
      }]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div v-for="i in 5"></div>
        <div v-for="f in 5"></div>
      </template>
      <script>
        export default {
          computed: {
            i () { }
          },
          methods: {
            f () { }
          }
        }
      </script>`,
      errors: [{
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier'
      }, {
        message: "Variable 'f' is already declared in the upper scope.",
        type: 'Identifier'
      }]
    }
  ]
})
