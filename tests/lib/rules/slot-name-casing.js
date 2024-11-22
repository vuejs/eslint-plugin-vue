/**
 * @author WayneZhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/slot-name-casing')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('slot-name-casing', rule, {
  valid: [
    `<template><slot key="foo" /></template>`,
    `<template><slot name /></template>`,
    `<template><slot name="foo" /></template>`,
    `<template><slot name="fooBar" /></template>`,
    `<template><slot :name="fooBar" /></template>`,
    {
      filename: 'test.vue',
      code: `
      <template>
      <slot name="foo" />
      <slot name="foo-bar" />
      <slot :name="fooBar" />
      </template>`,
      options: ['kebab-case']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <slot name="foo" />
      <slot :name="fooBar" />
      </template>`,
      options: ['singleword']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
      <slot name="foo-bar" />
      <slot name="foo-Bar_baz" />
      </template>`,
      errors: [
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-bar',
            caseType: 'camelCase'
          },
          line: 3,
          column: 13
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-Bar_baz',
            caseType: 'camelCase'
          },
          line: 4,
          column: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <slot name="fooBar" />
      <slot name="foo-Bar_baz" />
      </template>`,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'invalidCase',
          data: {
            name: 'fooBar',
            caseType: 'kebab-case'
          },
          line: 3,
          column: 13
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-Bar_baz',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <slot name="foo-bar" />
      <slot name="fooBar" />
      <slot name="foo-Bar_baz" />
      </template>`,
      options: ['singleword'],
      errors: [
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-bar',
            caseType: 'singleword'
          },
          line: 3,
          column: 13
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'fooBar',
            caseType: 'singleword'
          },
          line: 4,
          column: 13
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-Bar_baz',
            caseType: 'singleword'
          },
          line: 5,
          column: 13
        }
      ]
    }
  ]
})
