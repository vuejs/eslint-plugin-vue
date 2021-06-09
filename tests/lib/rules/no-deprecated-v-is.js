'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-v-is')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
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
