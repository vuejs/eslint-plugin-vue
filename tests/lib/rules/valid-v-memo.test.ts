/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-memo'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2021 }
})

tester.run('valid-v-memo', rule, {
  valid: [
    {
      filename: 'test.js',
      code: 'test'
    },
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo="[x]"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo="x"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo="x?y:z"></div></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-memo="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-memo="/**/" /></template>'
    },
    // v-for
    {
      filename: 'test.vue',
      code: '<template><div v-for="i in items" v-memo="[x]"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-memo:aaa="x"></div></template>',
      errors: [
        {
          message: "'v-memo' directives require no argument.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo.aaa="x"></div></template>',
      errors: [
        {
          message: "'v-memo' directives require no modifier.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo></div></template>',
      errors: [
        {
          message: "'v-memo' directives require that attribute value.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-memo="" /></template>',
      errors: [
        {
          message: "'v-memo' directives require that attribute value.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-memo="{x}" />
        <div v-memo="a ? {b}: c+d" />
        <div v-memo="(a,{b},c(),d+1)" />
        <div v-memo="()=>42" />
        <div v-memo="a=42" />
      </template>`,
      errors: [
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 25
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 29
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 34
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 5,
          column: 33,
          endLine: 5,
          endColumn: 36
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 28
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 7,
          column: 24,
          endLine: 7,
          endColumn: 26
        }
      ]
    },
    // v-for
    {
      filename: 'test.vue',
      code: `<template><div v-for="i in items"><div v-memo="[x]" /></div></template>`,
      errors: [
        {
          message: "'v-memo' directive does not work inside 'v-for'.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 46
        }
      ]
    }
  ]
})
