/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/arrow-spacing')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('arrow-spacing', rule, {
  valid: [
    `<template>
      <div :attr="() => a" />
    </template>`,
    `<template>
      <div @click="() => a" />
    </template>`,
    `<template>
      <div @click="
        const fn = () => a
        fn()
      " />
    </template>`,
    {
      code: `
        <template>
          <div :attr="()=>a" />
        </template>`,
      options: [{ before: false, after: false }]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <div :attr="()=>a" />
        </template>`,
      output: `
        <template>
          <div :attr="() => a" />
        </template>`,
      errors: [
        {
          message: 'Missing space before =>.',
          line: 3
        },
        {
          message: 'Missing space after =>.',
          line: 3
        }
      ]
    },
    {
      code: `
        <template>
          <div @click="()=>a" />
        </template>`,
      output: `
        <template>
          <div @click="() => a" />
        </template>`,
      errors: [
        {
          message: 'Missing space before =>.',
          line: 3
        },
        {
          message: 'Missing space after =>.',
          line: 3
        }
      ]
    },
    {
      code: `
        <template>
          <div @click="
            const fn = ()=>a
            fn()
          " />
        </template>`,
      output: `
        <template>
          <div @click="
            const fn = () => a
            fn()
          " />
        </template>`,
      errors: [
        {
          message: 'Missing space before =>.',
          line: 4
        },
        {
          message: 'Missing space after =>.',
          line: 4
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="() => a" />
        </template>`,
      options: [{ before: false, after: false }],
      output: `
        <template>
          <div :attr="()=>a" />
        </template>`,
      errors: [
        {
          message: 'Unexpected space before =>.',
          line: 3
        },
        {
          message: 'Unexpected space after =>.',
          line: 3
        }
      ]
    }
  ]
})
