/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../../eslint-compat').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder(
  'v-bind-same-name-shorthand',
  '^3.3.0'
)
const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/v-bind-same-name-shorthand', rule, {
  valid: [
    {
      code: `
      <template>
        <div :x />
      </template>`,
      options: buildOptions({ version: '3.4.0' })
    },
    {
      code: `
      <template>
      <div :x="x" />
      </template>`,
      options: buildOptions()
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :x />
      </template>`,
      output: `
      <template>
        <div :x="x" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`v-bind` same-name shorthand is not supported until Vue.js "3.4.0".',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :x />
      </template>`,
      output: `
      <template>
        <div :x="x" />
      </template>`,
      options: buildOptions({ version: '2.7.0' }),
      errors: [
        {
          message:
            '`v-bind` same-name shorthand is not supported until Vue.js "3.4.0".',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :data-x />
      </template>`,
      output: `
      <template>
        <div :data-x="dataX" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`v-bind` same-name shorthand is not supported until Vue.js "3.4.0".',
          line: 3
        }
      ]
    }
  ]
})
