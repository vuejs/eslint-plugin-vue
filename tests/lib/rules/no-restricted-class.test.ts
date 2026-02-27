/**
 * @author Tao Bojlen
 */

import rule from '../../../lib/rules/no-restricted-class'
import { RuleTester } from '../../eslint-compat.ts'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

ruleTester.run('no-restricted-class', rule as RuleModule, {
  valid: [
    `<template><div class="allowed">Content</div></template>`,
    `<template><div class>Content</div></template>`,
    `<template><div :class>Content</div></template>`,
    {
      code: `<template><div class="allowed"">Content</div></template>`,
      options: ['forbidden']
    },
    {
      code: `<template><div :class="'allowed' + forbidden">Content</div></template>`,
      options: ['forbidden']
    },
    {
      code: `<template><div @class="forbidden">Content</div></template>`,
      options: ['forbidden']
    },
    {
      code: `<template><div :class="'' + {forbidden: true}">Content</div></template>`,
      options: ['forbidden']
    },
    {
      code: `<template><div class="allowed">Content</div></template>`,
      options: ['/^for(bidden|gotten)/']
    }
  ],

  invalid: [
    {
      code: `<template><div class="forbidden allowed" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      code: `<template><div :class="'forbidden' + ' ' + 'allowed' + someVar" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      code: `<template><div :class="{'forbidden': someBool, someVar: true}" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `<template><div :class="{forbidden: someBool}" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: '<template><div :class="`forbidden ${someVar}`" /></template>',
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: `<template><div :class="'forbidden'" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      code: `<template><div :class="['forbidden', 'allowed']" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `<template><div :class="['allowed forbidden', someString]" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      code: `<template><div class="forbidden allowed" /></template>`,
      options: ['/^for(bidden|gotten)/'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 41
        }
      ]
    }
  ]
})
