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
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: `<template> </template>`,
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `<template>
</template>`,
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 2,
          endColumn: 12
        }
      ]
    },
    {
      code: '<template />',
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 13
        }
      ]
    },
    {
      code: '<template src="" />',
      output: '',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: '<template></template><script></script>',
      output: '<script></script>',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 22
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: '<template /><script />',
      output: '<script />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 13
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template src="" /><script src="" />',
      output: '<script src="" />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 20
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: '<template></template><script></script><style></style>',
      output: '<script></script>',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 22
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 39
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: '<template /><script /><style />',
      output: '<script />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 13
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 23
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: '<template src="" /><script src="" /><style src="" />',
      output: '<script src="" />',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 20
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 37
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 37,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    // auto fix with whitespace
    {
      code: '<template></template> <script></script> <style></style>',
      output: '  ',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 22
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 40
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      code: '<template /> <script /> <style />',
      output: '  ',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 13
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 24
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: '<template src="" /> <script src="" /> <style src="" />',
      output: '  ',
      errors: [
        {
          message: '`<template>` is empty. Empty block is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 20
        },
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 38
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      code: '<template><p></p></template> <script src="" /> <style src="" />',
      output: '<template><p></p></template>  ',
      errors: [
        {
          message: '`<script>` is empty. Empty block is not allowed.',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 47
        },
        {
          message: '`<style>` is empty. Empty block is not allowed.',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 64
        }
      ]
    }
  ]
})
