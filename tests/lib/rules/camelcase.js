/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/camelcase')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('camelcase', rule, {
  valid: [
    `<template>
      <div :attr="{ myPref: 1 }" />
    </template>`,
    {
      code: `
        <template>
          <div @click="($event) => {
            const { my_pref } = $event
          }" />
        </template>`,
      options: [{ ignoreDestructuring: true }]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <div :attr="{ my_pref: 1 }" />
        </template>`,
      errors: [
        {
          message: 'Identifier \'my_pref\' is not in camel case.',
          line: 3
        }
      ]
    },
    {
      code: `
        <template>
          <div @click="($event) => {
            const { my_pref } = $event
          }" />
        </template>`,
      errors: [
        {
          message: 'Identifier \'my_pref\' is not in camel case.',
          line: 4
        }
      ]
    }
  ]
})
