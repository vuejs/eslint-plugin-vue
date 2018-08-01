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
      errors: ['Unexpected spaces found around equal signs.']
    },
    {
      code: '<template><div attr = "" /></template>',
      output: '<template><div attr="" /></template>',
      errors: ['Unexpected spaces found around equal signs.']
    },
    {
      code: '<template><div attr = \'value\' /></template>',
      output: '<template><div attr=\'value\' /></template>',
      errors: ['Unexpected spaces found around equal signs.']
    },
    {
      code: '<template><div attr = value /></template>',
      output: '<template><div attr=value /></template>',
      errors: ['Unexpected spaces found around equal signs.']
    },

    {
      code: '<template><div attr \t\n   =   \t\n "value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: ['Unexpected spaces found around equal signs.']
    },
    {
      code: '<template><div attr ="value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: ['Unexpected spaces found around equal signs.']
    },
    {
      code: '<template><div attr= "value" /></template>',
      output: '<template><div attr="value" /></template>',
      errors: ['Unexpected spaces found around equal signs.']
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
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.',
        'Unexpected spaces found around equal signs.'
      ]
    }
  ]
})
