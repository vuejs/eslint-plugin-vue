/**
 * @author Tao Bojlen
 */

'use strict'

const rule = require('../../../lib/rules/no-restricted-class')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-restricted-class', rule, {
  valid: [
    { code: `<template><div class="allowed">Content</div></template>` },
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
    }
  ],

  invalid: [
    {
      code: `<template><div class="forbidden allowed" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'VAttribute'
        }
      ],
      options: ['forbidden']
    },
    {
      code: `<template><div :class="'forbidden' + ' ' + 'allowed' + someVar" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ],
      options: ['forbidden']
    },
    {
      code: `<template><div :class="{'forbidden': someBool, someVar: true}" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ],
      options: ['forbidden']
    },
    {
      code: `<template><div :class="{forbidden: someBool}" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Identifier'
        }
      ],
      options: ['forbidden']
    },
    {
      code: '<template><div :class="`forbidden ${someVar}`" /></template>',
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'TemplateElement'
        }
      ],
      options: ['forbidden']
    },
    {
      code: `<template><div :class="'forbidden'" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ],
      options: ['forbidden']
    },
    {
      code: `<template><div :class="['forbidden', 'allowed']" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ],
      options: ['forbidden']
    },
    {
      code: `<template><div :class="['allowed forbidden', someString]" /></template>`,
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ],
      options: ['forbidden']
    }
  ]
})
