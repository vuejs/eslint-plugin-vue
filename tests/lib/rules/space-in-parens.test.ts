/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/space-in-parens'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
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
        {
          messageId: 'rejectedOpeningSpace',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 24
        },
        {
          messageId: 'rejectedClosingSpace',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 28
        }
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
        {
          messageId: 'missingOpeningSpace',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 23
        },
        {
          messageId: 'missingClosingSpace',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 27
        }
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
        {
          messageId: 'rejectedOpeningSpace',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 21
        },
        {
          messageId: 'rejectedClosingSpace',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 27
        }
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
        {
          messageId: 'missingOpeningSpace',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 20
        },
        {
          messageId: 'missingClosingSpace',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        }
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
        {
          messageId: 'rejectedOpeningSpace',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 23
        },
        {
          messageId: 'rejectedClosingSpace',
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 29
        }
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
        {
          messageId: 'missingOpeningSpace',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 22
        },
        {
          messageId: 'missingClosingSpace',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 28
        }
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
        {
          messageId: 'rejectedOpeningSpace',
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 29
        },
        {
          messageId: 'rejectedClosingSpace',
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 33
        }
      ]
    }
  ]
})
