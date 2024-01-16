'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-deprecated-v-is')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('no-deprecated-v-is', rule, {
  valid: [
    `<template>
      <div is="vue:MyComponent" />
    </template>`,
    `<template>
      <component is="MyComponent" />
    </template>`
  ],
  invalid: [
    {
      code: `
      <template>
        <div v-is="'MyComponent'" />
      </template>`,
      errors: [
        {
          message: '`v-is` directive is deprecated.',
          line: 3
        }
      ]
    }
  ]
})
