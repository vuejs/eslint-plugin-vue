/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester, CLIEngine } = require('eslint')
const semver = require('semver')
const rule = require('../../../lib/rules/space-in-parens')

const errorMessage = semver.lt(CLIEngine.version, '6.4.0')
  ? (obj) => {
      const messageId = obj.messageId
      delete obj.messageId
      obj.message = messageId.startsWith('missing')
        ? 'There must be a space inside this paren.'
        : 'There should be no spaces inside this paren.'
      return obj
    }
  : (obj) => obj

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
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
    }
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
      options: ['always'],
      output: `
      <template>
        <button
          @click="foo( arg )"
        />
      </template>`,
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
      options: ['always'],
      output: `
      <template>
        <input
          :value="( 1 + 2 ) + 3"
        >
      </template>`,
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
      options: ['always'],
      output: `
      <template>
        <input
          :[(1+2)]="( 1 + 2 ) + 3"
        >
      </template>`,
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
    }
  ]
})
