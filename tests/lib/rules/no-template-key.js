/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-template-key')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-template-key', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><template></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div key="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:key="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :key="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list" :key="item.id"><div /></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="(item, i) in list" :key="i"><div /></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list" :key="foo + item.id"><div /></template></template>'
    },
    {
      filename: 'test.vue',
      // It is probably not valid, but it works as the Vue.js 3.x compiler.
      // We can prevent it with other rules. e.g. vue/require-v-for-key
      code: '<template><template v-for="item in list" key="foo"><div /></template></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><template key="foo"></template></div></template>',
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-bind:key="foo"></template></div></template>',
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template :key="foo"></template></div></template>',
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-slot="item" :key="item.id"><div /></template></template>',
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list"><template :key="item.id"><div /></template></template></template>',
      errors: [
        "'<template>' cannot be keyed. Place the key on real elements instead."
      ]
    }
  ]
})
