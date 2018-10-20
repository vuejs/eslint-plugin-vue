/**
 * @fileoverview enforce usage of `exact` modifier on `v-on`.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-v-on-exact')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('use-v-on-exact', rule, {

  valid: [
    {
      code: `<template><button @click="foo"/></template>`
    },
    {
      code: `<template><button @click="foo" :click="foo"/></template>`
    },
    {
      code: `<template><button @click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button @click.exact="foo"/></template>`
    },
    {
      code: `<template><button @click.exact="foo" @click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button v-on:click="foo"/></template>`
    },
    {
      code: `<template><button v-on:click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button v-on:click.exact="foo"/></template>`
    },
    {
      code: `<template><button v-on:click.exact="foo" v-on:click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button @click="foo" @focus="foo"/></template>`
    },
    {
      code: `<template><button @click="foo" @click="foo"/></template>`
    },
    {
      code: `<template><button @click="foo"/><button @click.ctrl="foo"/></template>`
    }
  ],

  invalid: [
    {
      code: `<template><button @click="foo" @click.ctrl="foo"/></template>`,
      errors: ["Consider to use '.exact' modifier."]
    },
    {
      code: `<template><button @click="foo" @focus="foo" @click.ctrl="foo"/></template>`,
      errors: ["Consider to use '.exact' modifier."]
    }
  ]
})
