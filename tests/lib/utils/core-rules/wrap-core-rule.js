'use strict'

const RuleTester = require('../../../eslint-compat').RuleTester
const utils = require('../../../../lib/utils/index')

const rule = utils.wrapCoreRule('foo')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('wrap-core-rule-with-unknown', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `var a`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template></template>`,
      errors: [
        {
          message:
            'Failed to extend ESLint core rule "foo". You may be able to use this rule by upgrading the version of ESLint. If you cannot upgrade it, turn off this rule.',
          line: 1,
          column: 1
        }
      ]
    }
  ]
})
