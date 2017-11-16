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
      code: `<template><component
        name="John Doe"
        age="30"
        job="Vet"
      ></component></template>`
    },
    {
      code: `<template><component
        name="John Doe"
        age="30"
        job="Vet"
      ></component></template>`,
      options: [{ multiline: { allowFirstLine: true }}]
    },
    {
      code: `<template><component
        name="John Doe"
        age="30"
      >
      </component></template>`
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
      code: `<template><component name="John Doe" age="30"></component></template>`,
      errors: ['Attribute "age" should be on a new line.']
    },
    {
      code: `<template><component job="Vet"
        name="John Doe"
        age="30">
        </component>
      </template>`,
      errors: [{
        message: 'Attribute "job" should be on a new line.',
        type: 'VAttribute',
        line: 1
      }]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: { max: 2 }}],
      errors: [{
        message: 'Attribute "job" should be on a new line.',
        type: 'VAttribute',
        line: 1
      }]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false }}],
      errors: [{
        message: 'Attribute "age" should be on a new line.',
        type: 'VAttribute',
        line: 1
      }, {
        message: 'Attribute "job" should be on a new line.',
        type: 'VAttribute',
        line: 1
      }]
    },
    {
      code: `<template><component name="John Doe"
        age="30">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false }}],
      errors: [{
        message: 'Attribute "name" should be on a new line.',
        type: 'VAttribute',
        line: 1
      }]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false }}],
      errors: [{
        message: 'Attribute "age" should be on a new line.',
        type: 'VAttribute',
        line: 2
      }]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 1 }],
      errors: [{
        message: 'Attribute "age" should be on a new line.',
        type: 'VAttribute',
        line: 2
      }]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog" petname="Snoopy">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false }}],
      errors: [{
        message: 'Attribute "petname" should be on a new line.',
        type: 'VAttribute',
        line: 3
      }]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog" petname="Snoopy" extra="foo">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false }}],
      errors: [{
        message: 'Attribute "petname" should be on a new line.',
        type: 'VAttribute',
        line: 3
      }, {
        message: 'Attribute "extra" should be on a new line.',
        type: 'VAttribute',
        line: 3
      }]
    }
  ]
})
