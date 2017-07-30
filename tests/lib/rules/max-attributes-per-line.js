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
      code: `<template><component></component></template>`
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ multiline: { allowFirstLine: true }}]
    },
    {
      code: `<template><component
        name="John Doe"
        age="30">
        </component>
      </template>`
    },
    {
      code: `<template><component
        name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 1 }]
    },
    {
      code: `<template><component></component></template>`,
      options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false }}]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false }}]
    },
    {
      code: `<template><component name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: true }}]
    },
    {
      code: `<template><component
        name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false }}]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false }}]
    }
  ],

  invalid: [
    {
      code: `<template><component name="John Doe" age="30" job="Vet" petname="Snoopy"></component></template>`,
      errors: ['Attribute "petname" should be on a new line.']
    },
    {
      code: `<template><component job="Vet"
        name="John Doe"
        age="30">
        </component>
      </template>`,
      errors: ['Attribute "job" should be on a new line.']
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false }}],
      errors: ['Attribute "age" should be on a new line.', 'Attribute "job" should be on a new line.']
    },
    {
      code: `<template><component name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false }}],
      errors: ['Attribute "name" should be on a new line.']
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false }}],
      errors: ['Attribute "age" should be on a new line.']
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog" petname="Snoopy">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false }}],
      errors: ['Attribute "petname" should be on a new line.']
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog" petname="Snoopy" extra="foo">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false }}],
      errors: [
        'Attribute "petname" should be on a new line.',
        'Attribute "extra" should be on a new line.'
      ]
    }
  ]
})
