/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/enforce-style-attribute')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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
      options: [{ allow: ['scoped'] }]
    },
    // With module option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style module></style>',
      options: [{ allow: ['module'] }]
    },
    // With plain option
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style></style>',
      options: [{ allow: ['plain'] }]
    },
    // With all options
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style scoped></style>',
      options: [{ allow: ['scoped', 'module', 'plain'] }]
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style module></style>',
      options: [{ allow: ['scoped', 'module', 'plain'] }]
    },
    {
      filename: 'test.vue',
      code: '<template></template><script></script><style></style>',
      options: [{ allow: ['scoped', 'module', 'plain'] }]
    }
  ],
  invalid: [
    // With default (scoped)
    {
      code: `<template></template><script></script><style></style>`,
      errors: [
        {
          message: 'Plain <style> tags are not allowed. Allowed: scoped.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: `<template></template><script></script><style module></style>`,
      errors: [
        {
          message: 'The module attribute is not allowed. Allowed: scoped.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 61
        }
      ]
    },
    // With scoped option
    {
      code: `<template></template><script></script><style></style>`,
      options: [{ allow: ['scoped'] }],
      errors: [
        {
          message: 'Plain <style> tags are not allowed. Allowed: scoped.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: `<template></template><script></script><style module></style>`,
      options: [{ allow: ['scoped'] }],
      errors: [
        {
          message: 'The module attribute is not allowed. Allowed: scoped.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 61
        }
      ]
    },
    // With module option
    {
      code: `<template></template><script></script><style></style>`,
      options: [{ allow: ['module'] }],
      errors: [
        {
          message: 'Plain <style> tags are not allowed. Allowed: module.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: `<template></template><script></script><style scoped></style>`,
      options: [{ allow: ['module'] }],
      errors: [
        {
          message: 'The scoped attribute is not allowed. Allowed: module.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 61
        }
      ]
    },
    // With different combinations of two options
    {
      code: `<template></template><script></script><style></style>`,
      options: [{ allow: ['module', 'scoped'] }],
      errors: [
        {
          message:
            'Plain <style> tags are not allowed. Allowed: module, scoped.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: `<template></template><script></script><style module></style>`,
      options: [{ allow: ['scoped', 'plain'] }],
      errors: [
        {
          message:
            'The module attribute is not allowed. Allowed: plain, scoped.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 61
        }
      ]
    },
    {
      code: `<template></template><script></script><style scoped></style>`,
      options: [{ allow: ['module', 'plain'] }],
      errors: [
        {
          message:
            'The scoped attribute is not allowed. Allowed: module, plain.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 61
        }
      ]
    }
  ]
})
