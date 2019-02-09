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
      code: `<template><button v-on:click="foo"/></template>`
    },
    {
      code: `<template><button v-on:click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button v-on:click.exact="foo"/></template>`
    },
    {
      code: `<template><button @click="foo" @click.stop="bar"/></template>`
    },
    {
      code: `<template><button @click="foo" @click.prevent="bar" @click.stop="baz"/></template>`
    },
    {
      code: `<template><button @click.prevent="foo" @click.stop="bar"/></template>`
    },
    {
      code: `<template><button @click.exact="foo" @click.ctrl="bar"/></template>`
    },
    {
      code: `<template><button @click.exact="foo" @click.ctrl.exact="bar" @click.ctrl.shift="baz"/></template>`
    },
    {
      code: `<template><button @click.ctrl.exact="foo" @click.ctrl.shift="bar"/></template>`
    },
    {
      code: `<template><button @click.exact="foo" @click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button @click="foo" @focus="foo"/></template>`
    },
    {
      code: `<template><button @click="foo" @click="foo"/></template>`
    },
    {
      code: `<template><button @click="foo"/><button @click.ctrl="foo"/></template>`
    },
    {
      code: `<template><button v-on:click.exact="foo" v-on:click.ctrl="foo"/></template>`
    },
    {
      code: `<template><a @mouseenter="showTooltip" @mouseenter.once="attachTooltip"/></template>`
    },
    {
      code: `<template><input @keypress.exact="foo" @keypress.esc.exact="bar" @keypress.ctrl="baz"></template>`
    },
    {
      code: `<template><input @keypress.a="foo" @keypress.b="bar" @keypress.a.b="baz"></template>`
    },
    {
      code: `<template><input @keypress.shift="foo" @keypress.ctrl="bar"></template>`
    },
    {
      code: `<template>
        <input
          @keypress.27="foo"
          @keypress.27.middle="bar"
        >
      </template>`
    },
    {
      code: `<template>
        <input
          @keydown.a.b.c="abc"
          @keydown.a="a"
          @keydown.b="b"
          @keydown.c="c"
        >
      </template>`
    },
    {
      code: `<template>
        <input
          @keydown.a.b="ab"
          @keydown.a="a"
          @keydown.b="b"
          @keydown.c="c"
          @keydown.a.c="ac"
        >
      </template>`
    },
    {
      code: `<template>
        <input
          @keydown.a.b="ab"
          @keydown.a="a"
          @keydown.b="b"
          @keydown.c="c"
        >
      </template>`
    },
    {
      code: `<template><UiButton @click="foo" /></template>`
    },
    {
      code: `<template><UiButton @click="foo" @click.native="bar" /></template>`
    },
    {
      code: `<template><UiButton @click="foo" @click.native.ctrl="bar" /></template>`
    },
    {
      code: `<template><UiButton @click="foo" @click.native.exact="bar" @click.native.ctrl="baz" /></template>`
    },
    {
      code: `<template><UiButton @click.native.exact="bar" @click.ctrl.native="baz" /></template>`
    },
    {
      code: `<template><UiButton @click.native.ctrl.exact="foo" @click.native.ctrl.shift="bar" /></template>`
    },
    {
      code: `<template><UiButton @click.native="foo" @click.native.stop="bar" /></template>`
    },
    {
      code: `<template><UiButton @click.native.stop="foo" @click.native.prevent="bar" /></template>`
    },
    {
      code: `<template><button @[click]="foo"/></template>`
    },
    {
      code: `<template><button @[foo]="foo" @[bar].ctrl="bar"/></template>`
    }
  ],

  invalid: [
    {
      code: `<template>
        <button
          @click="foo"
          @click.ctrl="bar"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 }
      ]
    },
    {
      code: `<template>
        <button
          @click="foo"
          @click.ctrl.stop="bar"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 }
      ]
    },
    {
      code: `<template>
        <button
          @click.prevent="foo"
          @click.ctrl="bar"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 }
      ]
    },
    {
      code: `<template>
        <button
          @click.exact="foo"
          @click.ctrl="bar"
          @click.ctrl.shift="baz"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 4 }
      ]
    },
    {
      code: `<template>
        <button
          @click="foo"
          @click.ctrl="bar"
          @click.ctrl.shift="baz"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 },
        { message: "Consider to use '.exact' modifier.", line: 4 }
      ]
    },
    {
      code: `<template>
        <input
          @keypress.27="foo"
          @keypress.27.shift="bar"
        >
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 }
      ]
    },
    {
      code: `<template>
        <input
          @keypress.exact="foo"
          @keypress.esc="bar"
          @keypress.ctrl="baz"
        >
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 4 }
      ]
    },
    {
      code: `<template>
        <UiButton
          @click="foo"
          @click.native="bar"
          @click.ctrl.native="baz"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 4 }
      ]
    },
    {
      code: `<template>
        <UiButton
          @click.native.ctrl="foo"
          @click.native.ctrl.shift="bar"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 }
      ]
    },
    {
      code: `<template>
        <UiButton
          @click.native="foo"
          @click.native.ctrl="bar"
          @click.native.ctrl.shift="baz"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 },
        { message: "Consider to use '.exact' modifier.", line: 4 }
      ]
    },
    {
      code: `<template>
        <button
          @[foo]="foo"
          @[foo].ctrl="bar"
        />
      </template>`,
      errors: [
        { message: "Consider to use '.exact' modifier.", line: 3 }
      ]
    }
  ]
})
