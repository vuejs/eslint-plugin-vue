/**
 * @author Yosuke Ota
 */
import { RuleTester } from 'eslint'
import rule from '../../../lib/rules/dot-location'
import { isESLintStylisticInstalled } from '../../test-utils/eslint-stylistic'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('dot-location', rule, {
  valid: [
    {
      code: `<template>
      <div
        :attr="foo.
          bar"
      />
    </template>`,
      options: ['object']
    },
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
      options: ['object'],
      errors: [
        {
          message: 'Expected dot to be on same line as object.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 14
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
      output: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      options: ['property'],
      errors: [
        {
          message: 'Expected dot to be on same line as property.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 22
        }
      ]
    }
  ]
})

// ESLint Stylistic v6 changed the default option from `object` to `property`,
// while the ESLint core rule still defaults to `object`.
tester.run('dot-location', rule, {
  valid: [
    isESLintStylisticInstalled
      ? `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`
      : `
      <template>
        <div
          :attr="foo.
            bar"
        />
      </template>`
  ],
  invalid: []
})
