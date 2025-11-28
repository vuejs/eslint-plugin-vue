/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/space-in-parens')

const errorMessage = (obj) => obj

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('space-in-parens', rule, {
  valid: [
    `<template>
      <button
        @click="foo(arg)"
      />
    </template>`,
    {
      code: `
      <template>
        <button
          @click="foo( arg )"
        />
      </template>`,
      options: ['always']
    },
    `
    <template>
      <button
        :[foo(arg)]="foo(arg)"
      />
    </template>`,
    {
      code: `
      <template>
        <button
          :[foo(arg)]="foo( arg )"
        />
      </template>`,
      options: ['always']
    },
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind('foo(arg)')
    }
    </style>`
  ],
  invalid: [
    {
      code: `
      <template>
        <button
          @click="foo( arg )"
        />
      </template>`,
      output: `
      <template>
        <button
          @click="foo(arg)"
        />
      </template>`,
      errors: [
        errorMessage({
          messageId: 'rejectedOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'rejectedClosingSpace',
          line: 4
        })
      ]
    },
    {
      code: `
      <template>
        <button
          @click="foo(arg)"
        />
      </template>`,
      output: `
      <template>
        <button
          @click="foo( arg )"
        />
      </template>`,
      options: ['always'],
      errors: [
        errorMessage({
          messageId: 'missingOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'missingClosingSpace',
          line: 4
        })
      ]
    },
    {
      code: `
      <template>
        <input
          :value="( 1 + 2 ) + 3"
        >
      </template>`,
      output: `
      <template>
        <input
          :value="(1 + 2) + 3"
        >
      </template>`,
      errors: [
        errorMessage({
          messageId: 'rejectedOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'rejectedClosingSpace',
          line: 4
        })
      ]
    },
    {
      code: `
      <template>
        <input
          :value="(1 + 2) + 3"
        >
      </template>`,
      output: `
      <template>
        <input
          :value="( 1 + 2 ) + 3"
        >
      </template>`,
      options: ['always'],
      errors: [
        errorMessage({
          messageId: 'missingOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'missingClosingSpace',
          line: 4
        })
      ]
    },
    {
      code: `
      <template>
        <input
          :[(1+2)]="( 1 + 2 ) + 3"
        >
      </template>`,
      output: `
      <template>
        <input
          :[(1+2)]="(1 + 2) + 3"
        >
      </template>`,
      errors: [
        errorMessage({
          messageId: 'rejectedOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'rejectedClosingSpace',
          line: 4
        })
      ]
    },
    {
      code: `
      <template>
        <input
          :[(1+2)]="(1 + 2) + 3"
        >
      </template>`,
      output: `
      <template>
        <input
          :[(1+2)]="( 1 + 2 ) + 3"
        >
      </template>`,
      options: ['always'],
      errors: [
        errorMessage({
          messageId: 'missingOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'missingClosingSpace',
          line: 4
        })
      ]
    },

    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind('foo( arg )')
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind('foo(arg)')
      }
      </style>`,
      errors: [
        errorMessage({
          messageId: 'rejectedOpeningSpace',
          line: 4
        }),
        errorMessage({
          messageId: 'rejectedClosingSpace',
          line: 4
        })
      ]
    }
  ]
})
