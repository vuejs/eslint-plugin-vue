/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-v-for-template-key')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-v-for-template-key', rule, {
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
      code: '<template><div><template key="foo"></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-bind:key="foo"></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template :key="foo"></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-slot="item" :key="item.id"><div /></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list"><template :key="item.id"><div /></template></template></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list" :key="item.id"><div /></template></template>',
      errors: [
        "'<template v-for>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="(item, i) in list" :key="i"><div /></template></template>',
      errors: [
        "'<template v-for>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list" :key="foo + item.id"><div /></template></template>',
      errors: [
        "'<template v-for>' cannot be keyed. Place the key on real elements instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in list" key="foo"><div /></template></template>',
      errors: [
        "'<template v-for>' cannot be keyed. Place the key on real elements instead."
      ]
    }
  ]
})
