/**
 * @author WayneZhang
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/slot-name-casing'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
        </template>
      `,
      options: ['kebab-case']
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <slot name="foo" />
          <slot :name="fooBar" />
        </template>
      `,
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
        </template>
      `,
      errors: [
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-bar',
            caseType: 'camelCase'
          },
          line: 3,
          column: 17,
          endLine: 3,
          endColumn: 31
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-Bar_baz',
            caseType: 'camelCase'
          },
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <slot name="fooBar" />
          <slot name="foo-Bar_baz" />
        </template>
      `,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'invalidCase',
          data: {
            name: 'fooBar',
            caseType: 'kebab-case'
          },
          line: 3,
          column: 17,
          endLine: 3,
          endColumn: 30
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-Bar_baz',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 35
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
        </template>
      `,
      options: ['singleword'],
      errors: [
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-bar',
            caseType: 'singleword'
          },
          line: 3,
          column: 17,
          endLine: 3,
          endColumn: 31
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'fooBar',
            caseType: 'singleword'
          },
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 30
        },
        {
          messageId: 'invalidCase',
          data: {
            name: 'foo-Bar_baz',
            caseType: 'singleword'
          },
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 35
        }
      ]
    }
  ]
})
