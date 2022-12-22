/**
 * @author alshyra
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/array-element-newline')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('array-element-newline', rule, {
  valid: [
    '<template><div :attr="[]" /></template>',
    '<template><div :attr="[a]" /></template>',
    `
      <template>
        <div :attr="[a,
                     b,
                     c]" />
      </template>`,
    `<template>
      <div :attr="[a,
                   b,
                   c
                  ]" />
    </template>`,
    '<template><div :[attr]="a" /></template>',
    '<template><div :[[attr]]="a" /></template>',
    `<template>
      <div :attr="[
                   a,
                   b,
                   c
                  ]" />
    </template>`,
    `
      <template>
        <div :attr="[a
                     b]" />
      </template>`,
    {
      code: `
        <template>
          <div :attr="[a,
                       b,
                       c]" />
        </template>`,
      options: ['always']
    },
    {
      code: '<template><div :attr="[a]" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="[a,b,c]" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="[a, b, c]" /></template>',
      options: [{ multiline: true }]
    },
    {
      code: `
        <template>
          <div :attr="[a, 
                      {
                        b:c
                      }]" />
        </template>`,
      options: [{ multiline: true }]
    },
    {
      code: '<template><div :attr="[a, b, c]" /></template>',
      options: ['consistent']
    },
    {
      code: `
        <template>
          <div :attr="[a,
                       b,
                       c
                      ]" />
        </template>`,
      options: ['consistent']
    },
    {
      code: '<template><div :attr="[a,b]" /></template>',
      options: [{ minItems: 3 }]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <div :attr="[a, b]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a,
b]" />
        </template>`,
      errors: [
        {
          message: 'There should be a linebreak after this element.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="[a,b,c]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a,
b,
c]" />
        </template>`,
      options: ['always'],
      errors: [
        {
          message: 'There should be a linebreak after this element.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 26
        },
        {
          message: 'There should be a linebreak after this element.',
          line: 3,
          column: 28,
          endLine: 3,
          endColumn: 28
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="[a,
                      b,c]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a,
                      b,
c]" />
        </template>`,
      options: ['always'],
      errors: [
        {
          message: 'There should be a linebreak after this element.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 25
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="[a,
                       b,c]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a,
                       b,
c]" />
        </template>`,
      options: ['consistent'],
      errors: [
        {
          message: 'There should be a linebreak after this element.',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="[a,
                       b, c]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a, b, c]" />
        </template>`,
      options: [{ multiline: true }],
      errors: [
        {
          message: 'There should be no linebreak here.',
          line: 3,
          column: 26,
          endLine: 4,
          endColumn: 24
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="[a, {
                            b:c
                          }]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a,
{
                            b:c
                          }]" />
        </template>`,
      options: [{ multiline: true }],
      errors: [
        {
          message: 'There should be a linebreak after this element.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="[a,b,c]" />
        </template>`,
      output: `
        <template>
          <div :attr="[a,
b,
c]" />
        </template>`,
      options: [{ minItems: 2 }],
      errors: [
        {
          message: 'There should be a linebreak after this element.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 26
        },
        {
          message: 'There should be a linebreak after this element.',
          line: 3,
          column: 28,
          endLine: 3,
          endColumn: 28
        }
      ]
    }
  ]
})
