/**
 * @fileoverview Define the number of attributes allows per line
 * @author Filipa Lacerda
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/max-attributes-per-line')

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('max-attributes-per-line', rule, {
  valid: [
    `<template><component></component></template>`,
    `<template><component
        name="John Doe"
        age="30"
        job="Vet"
      ></component></template>`,
    `<template><component
        name="John Doe"
        age="30"
      >
      </component></template>`,
    {
      code: `<template><component
        name="John Doe"
        age="30">
      </component>
      </template>`,
      options: [{ singleline: 1 }]
    },
    `<template><component job="Vet"
        name="John Doe"
        age="30">
        </component>
      </template>`
  ],

  invalid: [
    {
      code: `<template><component name="John Doe" age="30"></component></template>`,
      output: `<template><component name="John Doe"
age="30"></component></template>`,
      errors: [
        {
          message: "'age' should be on a new line.",
          line: 1,
          column: 38,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      code: `<template><component :name="user.name" :age="user.age"></component></template>`,
      output: `<template><component :name="user.name"
:age="user.age"></component></template>`,
      errors: [
        {
          message: "':age' should be on a new line.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      code: `<template><component :is="test" v-bind="user"></component></template>`,
      output: `<template><component :is="test"
v-bind="user"></component></template>`,
      errors: [
        {
          message: "'v-bind' should be on a new line.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      code: `<template><component :name="user.name" @buy="buyProduct"></component></template>`,
      output: `<template><component :name="user.name"
@buy="buyProduct"></component></template>`,
      errors: [
        {
          message: "'@buy' should be on a new line.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 57
        }
      ]
    },
    {
      code: `<template><component :name="user.name" @click.stop></component></template>`,
      output: `<template><component :name="user.name"
@click.stop></component></template>`,
      errors: [
        {
          message: "'@click.stop' should be on a new line.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      code: `<template><component :name="user.name" v-if="something"></component></template>`,
      output: `<template><component :name="user.name"
v-if="something"></component></template>`,
      errors: [
        {
          message: "'v-if' should be on a new line.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      code: `<template><component name="John Doe"    v-bind:age="user.age"></component></template>`,
      output: `<template><component name="John Doe"
v-bind:age="user.age"></component></template>`,
      errors: [
        {
          message: "'v-bind:age' should be on a new line.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 62
        }
      ]
    },
    {
      code: `<template><component name="John Doe" age="30" job="Vet"></component></template>`,
      output: `<template><component name="John Doe" age="30"
job="Vet"></component></template>`,
      options: [{ singleline: { max: 2 } }],
      errors: [
        {
          message: "'job' should be on a new line.",
          line: 1,
          column: 47,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      output: `<template><component
        name="John Doe"
age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ singleline: 3, multiline: 1 }],
      errors: [
        {
          message: "'age' should be on a new line.",
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 33
        }
      ]
    },
    {
      code: `<template><component
        name="John Doe" age="30"
        job="Vet">
        </component>
      </template>`,
      output: `<template><component
        name="John Doe"
age="30"
        job="Vet">
        </component>
      </template>`,
      options: [{ multiline: { max: 1 } }],
      errors: [
        {
          message: "'age' should be on a new line.",
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 33
        }
      ]
    }
  ]
})
