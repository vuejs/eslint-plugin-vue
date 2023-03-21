/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/enforce-style-attribute')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('enforce-style-attribute', rule, {
  valid: [
    // With default options
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style scoped></style>'
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style module></style>'
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style lang=scss" "src="../path/to/style.scss" scoped></style>'
    },
    // With scoped option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style scoped></style>',
      options: ['scoped']
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style lang=scss" "src="../path/to/style.scss" scoped></style>',
      options: ['scoped']
    },
    // With module option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style module></style>',
      options: ['module']
    }
  ],
  invalid: [
    // With default options
    {
      code: `<template></template><script></script><style></style>`,
      errors: [
        {
          message:
            'The <style> tag should have either the scoped or module attribute.'
        }
      ]
    },
    // With scoped option
    {
      code: `<template></template><script></script><style></style>`,
      errors: [
        {
          message: 'The <style> tag should have the scoped attribute.'
        }
      ],
      options: ['scoped']
    },
    {
      code: `<template></template><script></script><style module></style>`,
      errors: [
        {
          message: 'The <style> tag should have the scoped attribute.'
        }
      ],
      options: ['scoped']
    },
    // With module option
    {
      code: `<template></template><script></script><style></style>`,
      errors: [
        {
          message: 'The <style> tag should have the module attribute.'
        }
      ],
      options: ['module']
    },
    {
      code: `<template></template><script></script><style scoped></style>`,
      errors: [
        {
          message: 'The <style> tag should have the module attribute.'
        }
      ],
      options: ['module']
    }
  ]
})
