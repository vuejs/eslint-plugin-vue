/**
 * @fileoverview Enforce component opening tags with a single attribute to be on a single line
 * @author Jackson Gross
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/single-attribute-single-line')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('single-attribute-single-line', rule, {
  valid: [
    {
      code: `<template><component></component></template>`
    },
    {
      code: `<template><component /></template>`
    },
    {
      code: `<template>
        <component></component>
      </template>`
    },
    {
      code: `<template>
        <component />
      </template>`
    },
    {
      code: `<template><component name="John Doe"></component></template>`
    },
    {
      code: `<template><component name="John Doe"/></template>`
    },
    {
      code: `<template>
        <component name="John Doe"></component>
      </template>`
    },
    {
      code: `<template>
        <component name="John Doe" />
      </template>`
    },
    {
      code: `<template>
        <component name="John Doe">
          <p>Some content</p>
        </component>
      </template>`
    },
    {
      code: `<template>
        <component
          name="John Doe"
          age="12"
        >
          <p>Some content</p>
        </component>
      </template>`
    }
  ],

  invalid: [
    {
      code: `<template>
        <component
          name="John Doe"
        ></component>
      </template>`,
      output: `<template>
        <component name="John Doe"></component>
      </template>`,
      errors: ["'name' should be on a single line."]
    },
    {
      code: `<template>
        <component
          :name="user.name"
        ></component>
      </template>`,
      output: `<template>
        <component :name="user.name"></component>
      </template>`,
      errors: ["':name' should be on a single line."]
    },
    {
      code: `<template>
        <component
          v-bind="user"
        ></component>
      </template>`,
      output: `<template>
        <component v-bind="user"></component>
      </template>`,
      errors: ["'v-bind' should be on a single line."]
    },
    {
      code: `<template>
        <component
          @buy="buyProduct"
        ></component>
      </template>`,
      output: `<template>
        <component @buy="buyProduct"></component>
      </template>`,
      errors: ["'@buy' should be on a single line."]
    },
    {
      code: `<template>
        <component
          @click.stop
        ></component>
      </template>`,
      output: `<template>
        <component @click.stop></component>
      </template>`,
      errors: ["'@click.stop' should be on a single line."]
    },
    {
      code: `<template>
        <component
          v-if="something"
        ></component>
      </template>`,
      output: `<template>
        <component v-if="something"></component>
      </template>`,
      errors: ["'v-if' should be on a single line."]
    },
    {
      code: `<template>
        <component
          v-bind:name="user.name"
        ></component>
      </template>`,
      output: `<template>
        <component v-bind:name="user.name"></component>
      </template>`,
      errors: ["'v-bind:name' should be on a single line."]
    }
  ]
})
