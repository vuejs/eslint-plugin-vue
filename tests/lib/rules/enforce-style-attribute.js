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
    // Default (scoped)
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style scoped></style>'
    },
    // With scoped option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style scoped></style>',
      options: [{ allows: ['scoped'] }]
    },
    // With module option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style module></style>',
      options: [{ allows: ['module'] }]
    },
    // With plain option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style></style>',
      options: [{ allows: ['no-attributes'] }]
    },
    // With all options
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style scoped></style>',
      options: [{ allows: ['scoped', 'module', 'no-attributes'] }]
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style module></style>',
      options: [{ allows: ['scoped', 'module', 'no-attributes'] }]
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style></style>',
      options: [{ allows: ['scoped', 'module', 'no-attributes'] }]
    }
  ],
  invalid: [
    // With default (scoped)
    {
      code: `<template></template><script></script><style></style>`,
      errors: [
        {
          message:
            'A <style> tag without attributes is not allowed. Allowed: scoped.'
        }
      ]
    },
    {
      code: `<template></template><script></script><style module></style>`,
      errors: [
        {
          message: 'The module attribute is not allowed. Allowed: scoped.'
        }
      ]
    },
    // With scoped option
    {
      code: `<template></template><script></script><style></style>`,
      options: [{ allows: ['scoped'] }],
      errors: [
        {
          message:
            'A <style> tag without attributes is not allowed. Allowed: scoped.'
        }
      ]
    },
    {
      code: `<template></template><script></script><style module></style>`,
      options: [{ allows: ['scoped'] }],
      errors: [
        {
          message: 'The module attribute is not allowed. Allowed: scoped.'
        }
      ]
    },
    // With module option
    {
      code: `<template></template><script></script><style></style>`,
      options: [{ allows: ['module'] }],
      errors: [
        {
          message:
            'A <style> tag without attributes is not allowed. Allowed: module.'
        }
      ]
    },
    {
      code: `<template></template><script></script><style scoped></style>`,
      options: [{ allows: ['module'] }],
      errors: [
        {
          message: 'The scoped attribute is not allowed. Allowed: module.'
        }
      ]
    },
    // With different combinations of two options
    {
      code: `<template></template><script></script><style></style>`,
      options: [{ allows: ['module', 'scoped'] }],
      errors: [
        {
          message:
            'A <style> tag without attributes is not allowed. Allowed: module, scoped.'
        }
      ]
    },
    {
      code: `<template></template><script></script><style module></style>`,
      options: [{ allows: ['scoped', 'no-attributes'] }],
      errors: [
        {
          message:
            'The module attribute is not allowed. Allowed: no-attributes, scoped.'
        }
      ]
    },
    {
      code: `<template></template><script></script><style scoped></style>`,
      options: [{ allows: ['module', 'no-attributes'] }],
      errors: [
        {
          message:
            'The scoped attribute is not allowed. Allowed: module, no-attributes.'
        }
      ]
    }
  ]
})
