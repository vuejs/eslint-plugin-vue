/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat.ts'
import rule from '../../../lib/rules/camelcase'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
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
          message: "Identifier 'my_pref' is not in camel case.",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 32
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
          message: "Identifier 'my_pref' is not in camel case.",
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 28
        }
      ]
    },
    {
      code: `
        <template>
          <div @click="
            const { my_pref } = $event
          " />
        </template>`,
      errors: [
        {
          message: "Identifier 'my_pref' is not in camel case.",
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 28
        }
      ]
    }
  ]
})
