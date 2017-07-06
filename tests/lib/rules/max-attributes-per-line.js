/**
 * @fileoverview Define the number of attributes allows per line
 * @author Filipa Lacerda
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/max-attributes-per-line')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('max-attributes-per-line', rule, {
  valid: [
    {
      code: `<template><component></component></template>`,
      options: [{ singleline: 1, multiline: 1, firstline: 0 }]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: 3, multiline: 1, firstline: 0 }]
    },
    {
      code: `<template><component name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 1, firstline: 1 }]
    },
    {
      code: `<template><component
        name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 1, firstline: 0 }]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 2, firstline: 0 }]
    }
  ],

  invalid: [
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: 1, multiline: 1, firstline: 0 }],
      errors: ['It has more than 1 attributes per line.']
    },
    {
      code: `<template><component name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 1, firstline: 0 }],
      errors: ['Attribute name should be on a new line.']
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 1, firstline: 0 }],
      errors: ['Attribute age should be on a new line.']
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog" petname="Snoopy">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 2, firstline: 0 }],
      errors: ['Attribute petname should be on a new line.']
    }
  ]
})
