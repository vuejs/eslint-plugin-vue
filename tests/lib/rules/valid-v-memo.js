/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-memo')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2021 }
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
      errors: ["'v-memo' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo.aaa="x"></div></template>',
      errors: ["'v-memo' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-memo></div></template>',
      errors: ["'v-memo' directives require that attribute value."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-memo="" /></template>',
      errors: ["'v-memo' directives require that attribute value."]
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
          column: 22
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 4,
          column: 26
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 4,
          column: 31
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 5,
          column: 33
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 6,
          column: 22
        },
        {
          message:
            "'v-memo' directives require the attribute value to be an array.",
          line: 7,
          column: 24
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
          column: 40
        }
      ]
    }
  ]
})
