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
    ecmaVersion: 2018,
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
        <div v-for="i in f"></div>
        <div v-for="i in 5"></div>
      </template>
      <script>
        export default {
          computed: {
            f () { }
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div v-for="i in b" />
        <div v-for="b in c" />
        <div v-for="d in f" />
      </template>
      <script>
        export default {
          ...a,
          data() {
            return {
              ...b,
              c: [1, 2, 3]
            }
          },
          computed: {
            ...d,
            e,
            ['f']: [1, 2],
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
        type: 'Identifier',
        line: 2
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
        type: 'Identifier',
        line: 2
      }, {
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier',
        line: 3
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
        type: 'Identifier',
        line: 2
      }, {
        message: "Variable 'i' is already declared in the upper scope.",
        type: 'Identifier',
        line: 3
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
        type: 'Identifier',
        line: 2
      }, {
        message: "Variable 'f' is already declared in the upper scope.",
        type: 'Identifier',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div v-for="i in c" />
        <div v-for="a in c" />
        <div v-for="b in c" />
        <div v-for="d in c" />
        <div v-for="e in f" />
        <div v-for="f in c" />
      </template>
      <script>
        export default {
          ...a,
          data() {
            return {
              ...b,
              c: [1, 2, 3]
            }
          },
          computed: {
            ...d,
            e,
            ['f']: [1, 2],
          }
        }
      </script>`,
      errors: [{
        message: "Variable 'e' is already declared in the upper scope.",
        type: 'Identifier',
        line: 6
      }, {
        message: "Variable 'f' is already declared in the upper scope.",
        type: 'Identifier',
        line: 7
      }]
    }
  ]
})
