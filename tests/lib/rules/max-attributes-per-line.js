/**
 * @fileoverview Define the number of attributes allows per line
 * @author Filipa Lacerda
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/max-attributes-per-line')

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
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
      code: `<template><component job="Vet"
        name="John Doe"
        age="30">
        </component>
      </template>`
    }
  ],

  invalid: [
    {
      code: `<template><component name="John Doe" age="30"></component></template>`,
      output: `<template><component name="John Doe"
age="30"></component></template>`,
      errors: ["'age' should be on a new line."]
    },
    {
      code: `<template><component :name="user.name" :age="user.age"></component></template>`,
      output: `<template><component :name="user.name"
:age="user.age"></component></template>`,
      errors: ["':age' should be on a new line."]
    },
    {
      code: `<template><component :is="test" v-bind="user"></component></template>`,
      output: `<template><component :is="test"
v-bind="user"></component></template>`,
      errors: ["'v-bind' should be on a new line."]
    },
    {
      code: `<template><component :name="user.name" @buy="buyProduct"></component></template>`,
      output: `<template><component :name="user.name"
@buy="buyProduct"></component></template>`,
      errors: ["'@buy' should be on a new line."]
    },
    {
      code: `<template><component :name="user.name" @click.stop></component></template>`,
      output: `<template><component :name="user.name"
@click.stop></component></template>`,
      errors: ["'@click.stop' should be on a new line."]
    },
    {
      code: `<template><component :name="user.name" v-if="something"></component></template>`,
      output: `<template><component :name="user.name"
v-if="something"></component></template>`,
      errors: ["'v-if' should be on a new line."]
    },
    {
      code: `<template><component name="John Doe"    v-bind:age="user.age"></component></template>`,
      output: `<template><component name="John Doe"
v-bind:age="user.age"></component></template>`,
      errors: ["'v-bind:age' should be on a new line."]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      options: [{ singleline: { max: 2 } }],
      output: `<template><component name="John Doe" age="30"
job="Vet"></component></template>`,
      errors: [
        {
          message: "'job' should be on a new line.",
          type: 'VAttribute',
          line: 1
        }
      ]
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
      errors: [
        {
          message: "'age' should be on a new line.",
          type: 'VAttribute',
          line: 2
        }
      ]
    }
  ]
})
