/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/comma-dangle')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2018 }
})

tester.run('comma-dangle', rule, {
  valid: [
    `<template>
      <button @click="() => fn([a, b])" ></button>
    </template>`,
    {
      code: `
        <template>
          <CustomButton @click="($event) => fn()" />
        </template>`,
      options: [{
        'functions': 'never'
      }]
    },
    {
      code: `
        <template>
          <button @click="() => fn([a, b, ])" ></button>
        </template>`,
      options: [{
        'arrays': 'ignore'
      }]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <button @click="() => fn([a, b,])" ></button>
        </template>`,
      output: `
        <template>
          <button @click="() => fn([a, b])" ></button>
        </template>`,
      errors: [
        {
          message: 'Unexpected trailing comma.',
          line: 3
        }
      ]
    },
    {
      code: `
        <template>
          <CustomButton @click="($event, ) => fn()" />
        </template>`,
      options: [{
        'functions': 'never'
      }],
      output: `
        <template>
          <CustomButton @click="($event ) => fn()" />
        </template>`,
      errors: [
        {
          message: 'Unexpected trailing comma.',
          line: 3
        }
      ]
    },
    {
      code: `
        <template>
          <button @click="() => {
            fn([a, b, ])
            fn([
              a,
              b
            ])
          }"></button>
        </template>`,
      options: ['always-multiline'],
      output: `
        <template>
          <button @click="() => {
            fn([a, b ])
            fn([
              a,
              b,
            ])
          }"></button>
        </template>`,
      errors: [
        {
          message: 'Unexpected trailing comma.',
          line: 4
        },
        {
          message: 'Missing trailing comma.',
          line: 7
        }
      ]
    }
  ]
})
