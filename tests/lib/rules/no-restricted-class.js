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
    `<template><div class="allowed">Content</div></template>`,
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
          type: 'VAttribute'
        }
      ]
    },
    {
      code: `<template><div :class="'forbidden' + ' ' + 'allowed' + someVar" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ]
    },
    {
      code: `<template><div :class="{'forbidden': someBool, someVar: true}" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ]
    },
    {
      code: `<template><div :class="{forbidden: someBool}" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Identifier'
        }
      ]
    },
    {
      code: '<template><div :class="`forbidden ${someVar}`" /></template>',
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'TemplateElement'
        }
      ]
    },
    {
      code: `<template><div :class="'forbidden'" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ]
    },
    {
      code: `<template><div :class="['forbidden', 'allowed']" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ]
    },
    {
      code: `<template><div :class="['allowed forbidden', someString]" /></template>`,
      options: ['forbidden'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'Literal'
        }
      ]
    },
    {
      code: `<template><div class="forbidden allowed" /></template>`,
      options: ['/^for(bidden|gotten)/'],
      errors: [
        {
          message: "'forbidden' class is not allowed.",
          type: 'VAttribute'
        }
      ]
    }
  ]
})
