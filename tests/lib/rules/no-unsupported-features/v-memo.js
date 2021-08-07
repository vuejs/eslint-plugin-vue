/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('v-memo', '^3.1.0')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/v-memo', rule, {
  valid: [
    {
      code: `
      <template>
        <div v-memo="foo" />
      </template>`,
      options: buildOptions({ version: '^3.2.0' })
    },
    {
      code: `
      <template>
        <div :memo="foo" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <div v-memo="foo" />
      </template>`,
      options: buildOptions({ version: '^2.5.0', ignores: ['v-memo'] })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div v-memo="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-memo` are not supported until Vue.js "3.2.0".',
          line: 3
        }
      ]
    }
  ]
})
