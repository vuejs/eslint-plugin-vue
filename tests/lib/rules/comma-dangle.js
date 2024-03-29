/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/comma-dangle')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2018 }
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
      options: [
        {
          functions: 'never'
        }
      ]
    },
    {
      code: `
        <template>
          <button @click="() => fn([a, b, ])" ></button>
        </template>`,
      options: [
        {
          arrays: 'ignore'
        }
      ]
    },
    `
      <template>
        <button :[[a,b][1]]="a" ></button>
      </template>
    `,
    {
      code: `
      <template>
        <button :[[a,b,][1]]="a" ></button>
      </template>`,
      options: ['always']
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
      output: `
        <template>
          <CustomButton @click="($event ) => fn()" />
        </template>`,
      options: [
        {
          functions: 'never'
        }
      ],
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
      options: ['always-multiline'],
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
    },
    {
      code: `
      <template>
        <button :[[a,b,][1]]="a" ></button>
      </template>`,
      output: `
      <template>
        <button :[[a,b][1]]="a" ></button>
      </template>`,
      errors: [
        {
          message: 'Unexpected trailing comma.'
        }
      ]
    },
    {
      code: `
      <template>
        <button :[[a,b][1]]="a" ></button>
      </template>`,
      output: `
      <template>
        <button :[[a,b,][1]]="a" ></button>
      </template>`,
      options: ['always'],
      errors: [
        {
          message: 'Missing trailing comma.'
        }
      ]
    }
  ]
})
