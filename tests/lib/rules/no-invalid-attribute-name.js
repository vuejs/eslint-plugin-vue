/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-invalid-attribute-name')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-invalid-attribute-name', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><p foo /></template>'
    },
    {
      filename: 'test.vue',
      code: `<template><p foo="bar" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p foo-bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p _foo-bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p :foo-bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p foo.bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p quux-.9 /></template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template><p 0abc /></template>`,
      errors: [
        {
          message: 'Attribute name 0abc is not valid.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><p -def></template>`,
      errors: [
        {
          message: 'Attribute name -def is not valid.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><p !ghi /></template>`,
      errors: [
        {
          message: 'Attribute name !ghi is not valid.'
        }
      ]
    }
  ]
})
