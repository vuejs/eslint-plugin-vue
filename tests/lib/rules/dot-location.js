/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/dot-location')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('dot-location', rule, {
  valid: [
    `<template>
      <div
        :attr="foo.
          bar"
      />
    </template>`,
    {
      code: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      options: ['property']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      output: `
      <template>
        <div
          :attr="foo.
            bar"
        />
      </template>`,
      errors: [
        {
          message: 'Expected dot to be on same line as object.',
          line: 5
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :attr="foo.
            bar"
        />
      </template>`,
      options: ['property'],
      output: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      errors: [
        {
          message: 'Expected dot to be on same line as property.',
          line: 4
        }
      ]
    }
  ]
})
