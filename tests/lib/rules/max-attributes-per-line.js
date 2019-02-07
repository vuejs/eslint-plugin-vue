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
      output: `<template><component name="John Doe"
age="30"></component></template>`,
      errors: ['\'age\' should be on a new line.']
    },
    {
      code: `<template><component :name="user.name" :age="user.age"></component></template>`,
      output: `<template><component :name="user.name"
:age="user.age"></component></template>`,
      errors: ['\':age\' should be on a new line.']
    },
    {
      code: `<template><component :is="test" v-bind="user"></component></template>`,
      output: `<template><component :is="test"
v-bind="user"></component></template>`,
      errors: ['\'v-bind\' should be on a new line.']
    },
    {
      code: `<template><component :name="user.name" @buy="buyProduct"></component></template>`,
      output: `<template><component :name="user.name"
@buy="buyProduct"></component></template>`,
      errors: ['\'@buy\' should be on a new line.']
    },
    {
      code: `<template><component :name="user.name" @click.stop></component></template>`,
      output: `<template><component :name="user.name"
@click.stop></component></template>`,
      errors: ['\'@click.stop\' should be on a new line.']
    },
    {
      code: `<template><component :name="user.name" v-if="something"></component></template>`,
      output: `<template><component :name="user.name"
v-if="something"></component></template>`,
      errors: ['\'v-if\' should be on a new line.']
    },
    {
      code: `<template><component name="John Doe"    v-bind:age="user.age"></component></template>`,
      output: `<template><component name="John Doe"
v-bind:age="user.age"></component></template>`,
      errors: ['\'v-bind:age\' should be on a new line.']
    },
    {
      code: `<template><component job="Vet"
        name="John Doe"
        age="30">
        </component>
      </template>`,
      output: `<template><component
job="Vet"
        name="John Doe"
        age="30">
        </component>
      </template>`,
      errors: [{
        message: '\'job\' should be on a new line.',
        type: 'VAttribute',
        line: 1
      }]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: { max: 2 }}],
      output: `<template><component name="John Doe" age="30"
job="Vet"></component></template>`,
      errors: [{
        message: '\'job\' should be on a new line.',
        type: 'VAttribute',
        line: 1
      }]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false }}],
      output: `<template><component name="John Doe"
age="30" job="Vet"></component></template>`,
      errors: [{
        message: '\'age\' should be on a new line.',
        type: 'VAttribute',
        line: 1
      }, {
        message: '\'job\' should be on a new line.',
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
      output: `<template><component
name="John Doe"
        age="30">
        </component>
      </template>`,
      errors: [{
        message: '\'name\' should be on a new line.',
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
      output: `<template><component
        name="John Doe"
age="30"
        job="Vet">
        </component>
      </template>`,
      errors: [{
        message: '\'age\' should be on a new line.',
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
      output: `<template><component
        name="John Doe"
age="30"
        job="Vet">
        </component>
      </template>`,
      errors: [{
        message: '\'age\' should be on a new line.',
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
      output: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog"
petname="Snoopy">
        </component>
      </template>`,
      errors: [{
        message: '\'petname\' should be on a new line.',
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
      output: `<template><component
        name="John Doe" age="30"
        job="Vet" pet="dog"
petname="Snoopy" extra="foo">
        </component>
      </template>`,
      errors: [{
        message: '\'petname\' should be on a new line.',
        type: 'VAttribute',
        line: 3
      }, {
        message: '\'extra\' should be on a new line.',
        type: 'VAttribute',
        line: 3
      }]
    }
  ]
})
