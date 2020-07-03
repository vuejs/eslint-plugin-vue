/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-empty-component-block')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2018 }
})

tester.run('no-empty-component-block', rule, {
  valid: [
    `<template><p>foo</p></template>`,
    `<template>  foobar   </template>`,
    `<template><p>foo</p></template><script>console.log('foo')</script>`,
    `<template><p>foo</p></template><script>console.log('foo')</script><style>p{display: inline;}</style>`,
    `<template src="./template.html"></template>`,
    `<template src="./template.html" />`,
    `<template src="./template.html"></template><script src="./script.js"></script>`,
    `<template src="./template.html" /><script src="./script.js" />`,
    `<template src="./template.html"></template><script src="./script.js"></script><style src="./style.css"></style>`,
    `<template src="./template.html" /><script src="./script.js" /><style src="./style.css" />`,
    `var a = 1`
  ],
  invalid: [
    {
      code: `<template></template>`,
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: `<template> </template>`,
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: `<template>
</template>`,
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template src="" />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template></template><script></script>',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template /><script />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template src="" /><script src="" />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template></template><script></script><style></style>',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template /><script /><style />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template src="" /><script src="" /><style src="" />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.'
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.'
        }
      ]
    }
  ]
})
