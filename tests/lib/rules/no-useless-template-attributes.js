/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-useless-template-attributes')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-useless-template-attributes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-if="foo">...</template>
        <template v-else-if="bar">...</template>
        <template v-else>...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-for="e in list">...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-slot>...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template slot="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template slot-scope="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template scope="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- ignore -->
        <template foo="a">...</template>
        <template :foo="a">...</template>
        <template v-unknown="a">...</template>
      </template>
      `
    },
    // not template
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" class="heading">...</div>
        <div v-for="i in foo" :bar="i">...</div>
        <div v-slot:foo="foo" ref="input">...</div>
        <div v-if="foo" @click="click">...</div>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- ✓ GOOD -->
        <template v-if="foo">...</template>
        <template v-if="foo">...</template>
        <template v-else-if="foo">...</template>
        <template v-else>...</template>
        <template v-for="i in foo" :key="i">...</template>
        <template v-slot:foo>...</template>
        <!-- for Vue<=2.5 -->
        <template slot="foo">...</template>
        <template :slot="foo">...</template>
        <template slot-scope="param">...</template>
        <!-- for Vue<=2.4 -->
        <template scope="param">...</template>

        <!-- ✗ BAD -->
        <template v-if="foo" class="heading">...</template>
        <template v-for="i in foo" :bar="i">...</template>
        <template v-slot:foo="foo" ref="input">...</template>
        <template v-if="foo" @click="click">...</template>

        <!-- Ignore -->
        <template class="heading">...</template>
        <template :bar="i">...</template>
        <template ref="input">...</template>
        <template @click="click">...</template>
      </template>
      `,
      errors: [
        {
          message: 'Unexpected useless attribute on `<template>`.',
          line: 18,
          column: 30
        },
        {
          message: 'Unexpected useless directive on `<template>`.',
          line: 19,
          column: 36
        },
        {
          message: 'Unexpected useless attribute on `<template>`.',
          line: 20,
          column: 36
        },
        {
          message: 'Unexpected useless directive on `<template>`.',
          line: 21,
          column: 30
        }
      ]
    }
  ]
})
