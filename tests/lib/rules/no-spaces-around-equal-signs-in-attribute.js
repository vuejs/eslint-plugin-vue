/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-spaces-around-equal-signs-in-attribute')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser'
})

tester.run('no-spaces-around-equal-signs-in-attribute', rule, {
  valid: [
    '<template><div attr="value" /></template>',
    '<template><div attr="" /></template>',
    '<template><div attr=\'value\' /></template>',
    '<template><div attr=value /></template>',
    '<template><div attr /></template>',
    '<template><div/></template>',
    `<template>
      <div
        is="header"
        v-for="item in items"
        v-if="!visible"
        v-once
        id="uniqueID"
        ref="header"
        v-model="headerData"
        myProp="prop"
        @click="functionCall"
        v-text="textContent">
      </div>
    </template>`
  ],
  invalid: [
    {
      code: '<template><div attr = "value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><div attr = "" /></template>',
      output: '<template><div attr="" /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><div attr = \'value\' /></template>',
      output: '<template><div attr=\'value\' /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><div attr = value /></template>',
      output: '<template><div attr=value /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><div attr \t\n   =   \t\n "value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 3,
          endColumn: 2
        }
      ]
    },
    {
      code: '<template><div attr ="value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: '<template><div attr= "value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code:
        `<template>
          <div
            is = "header"
            v-for = "item in items"
            v-if = "!visible"
            v-once
            id = "uniqueID"
            ref = "header"
            v-model = "headerData"
            myProp = "prop"
            @click = "functionCall"
            v-text = "textContent">
          </div>
        </template>`,
      output:
        `<template>
          <div
            is="header"
            v-for="item in items"
            v-if="!visible"
            v-once
            id="uniqueID"
            ref="header"
            v-model="headerData"
            myProp="prop"
            @click="functionCall"
            v-text="textContent">
          </div>
        </template>`,
      errors: [
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 18
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 21
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 20
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 18
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 8,
          column: 16,
          endLine: 8,
          endColumn: 19
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 9,
          column: 20,
          endLine: 9,
          endColumn: 23
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 10,
          column: 19,
          endLine: 10,
          endColumn: 22
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 11,
          column: 19,
          endLine: 11,
          endColumn: 22
        },
        {
          message: 'Unexpected spaces found around equal signs.',
          line: 12,
          column: 19,
          endLine: 12,
          endColumn: 22
        }
      ]
    }
  ]
})
