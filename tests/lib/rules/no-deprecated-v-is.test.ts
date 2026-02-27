import { RuleTester } from '../../eslint-compat.ts'
import rule from '../../../lib/rules/no-deprecated-v-is'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
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
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 18
        }
      ]
    }
  ]
})
