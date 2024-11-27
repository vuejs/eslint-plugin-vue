/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-empty-component-block')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2018 }
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
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: `<template> </template>`,
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: `<template>
</template>`,
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template />',
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template src="" />',
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.'
        }
      ]
    },
    {
      code: '<template></template><script></script>',
      output: '<script></script>',
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
      output: '<script />',
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
      output: '<script src="" />',
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
      output: '<script></script>',
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
      output: '<script />',
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
      output: '<script src="" />',
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
    // auto fix with whitespace
    {
      code: '<template></template> <script></script> <style></style>',
      output: '  ',
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
      code: '<template /> <script /> <style />',
      output: '  ',
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
      code: '<template src="" /> <script src="" /> <style src="" />',
      output: '  ',
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
      code: '<template><p></p></template> <script src="" /> <style src="" />',
      output: '<template><p></p></template>  ',
      errors: [
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
