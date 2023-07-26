/**
 * @fileoverview enforce usage of `exact` modifier on `v-on`.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/use-v-on-exact')

const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('use-v-on-exact', rule, {
  valid: [
    `<template><button @click="foo"/></template>`,
    `<template><button @click="foo" :click="foo"/></template>`,
    `<template><button @click.ctrl="foo"/></template>`,
    `<template><button @click.exact="foo"/></template>`,
    `<template><button v-on:click="foo"/></template>`,
    `<template><button v-on:click.ctrl="foo"/></template>`,
    `<template><button v-on:click.exact="foo"/></template>`,
    `<template><button @click="foo" @click.stop="bar"/></template>`,
    `<template><button @click="foo" @click.prevent="bar" @click.stop="baz"/></template>`,
    `<template><button @click.prevent="foo" @click.stop="bar"/></template>`,
    `<template><button @click.exact="foo" @click.ctrl="bar"/></template>`,
    `<template><button @click.exact="foo" @click.ctrl.exact="bar" @click.ctrl.shift="baz"/></template>`,
    `<template><button @click.ctrl.exact="foo" @click.ctrl.shift="bar"/></template>`,
    `<template><button @click.exact="foo" @click.ctrl="foo"/></template>`,
    `<template><button @click="foo" @focus="foo"/></template>`,
    `<template><button @click="foo" @click="foo"/></template>`,
    `<template><button @click="foo"/><button @click.ctrl="foo"/></template>`,
    `<template><button v-on:click.exact="foo" v-on:click.ctrl="foo"/></template>`,
    `<template><a @mouseenter="showTooltip" @mouseenter.once="attachTooltip"/></template>`,
    `<template><input @keypress.exact="foo" @keypress.esc.exact="bar" @keypress.ctrl="baz"></template>`,
    `<template><input @keypress.a="foo" @keypress.b="bar" @keypress.a.b="baz"></template>`,
    `<template><input @keypress.shift="foo" @keypress.ctrl="bar"></template>`,
    `
      <template>
        <input
          @keypress.27="foo"
          @keypress.27.middle="bar"
        >
      </template>
    `,
    `
      <template>
        <input
          @keydown.a.b.c="abc"
          @keydown.a="a"
          @keydown.b="b"
          @keydown.c="c"
        >
      </template>
    `,
    `
      <template>
        <input
          @keydown.a.b="ab"
          @keydown.a="a"
          @keydown.b="b"
          @keydown.c="c"
          @keydown.a.c="ac"
        >
      </template>
    `,
    `
      <template>
        <input
          @keydown.a.b="ab"
          @keydown.a="a"
          @keydown.b="b"
          @keydown.c="c"
        >
      </template>
    `,
    `<template><UiButton @click="foo" /></template>`,
    `<template><UiButton @click="foo" @click.native="bar" /></template>`,
    `<template><UiButton @click="foo" @click.native.ctrl="bar" /></template>`,
    `<template><UiButton @click="foo" @click.native.exact="bar" @click.native.ctrl="baz" /></template>`,
    `<template><UiButton @click.native.exact="bar" @click.ctrl.native="baz" /></template>`,
    `<template><UiButton @click.native.ctrl.exact="foo" @click.native.ctrl.shift="bar" /></template>`,
    `<template><UiButton @click.native="foo" @click.native.stop="bar" /></template>`,
    `<template><UiButton @click.native.stop="foo" @click.native.prevent="bar" /></template>`,
    `<template><button @[click]="foo"/></template>`,
    `<template><button @[foo]="foo" @[bar].ctrl="bar"/></template>`,
    `
      <template>
        <input
          @keydown.enter="foo"
          @keydown.shift.tab="bar"/>
      </template>
    `,
    `
      <template>
        <input
          @keydown.enter="foo"
          @keydown.shift.tab.prevent="bar"/>
      </template>
    `,
    `
      <template>
        <input-component
          @keydown.enter.native="foo"
          @keydown.shift.tab.native="bar"/>
      </template>
    `
  ],

  invalid: [
    {
      code: `<template>
        <button
          @click="foo"
          @click.ctrl="bar"
        />
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 3 }]
    },
    {
      code: `<template>
        <button
          @click="foo"
          @click.ctrl.stop="bar"
        />
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 3 }]
    },
    {
      code: `<template>
        <button
          @click.prevent="foo"
          @click.ctrl="bar"
        />
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 3 }]
    },
    {
      code: `<template>
        <button
          @click.exact="foo"
          @click.ctrl="bar"
          @click.ctrl.shift="baz"
        />
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 4 }]
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
      errors: [{ message: "Consider to use '.exact' modifier.", line: 3 }]
    },
    {
      code: `<template>
        <input
          @keypress.exact="foo"
          @keypress.esc="bar"
          @keypress.ctrl="baz"
        >
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 4 }]
    },
    {
      code: `<template>
        <UiButton
          @click="foo"
          @click.native="bar"
          @click.ctrl.native="baz"
        />
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 4 }]
    },
    {
      code: `<template>
        <UiButton
          @click.native.ctrl="foo"
          @click.native.ctrl.shift="bar"
        />
      </template>`,
      errors: [{ message: "Consider to use '.exact' modifier.", line: 3 }]
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
      errors: [{ message: "Consider to use '.exact' modifier.", line: 3 }]
    }
  ]
})
