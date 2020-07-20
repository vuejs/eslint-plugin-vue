/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder(
  'dynamic-directive-arguments',
  '^2.5.0'
)
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/dynamic-directive-arguments', rule, {
  valid: [
    {
      code: `
      <template>
        <a :[href]="'/xxx'" />
      </template>`,
      options: buildOptions({ version: '^2.6.0' })
    },
    {
      code: `
      <template>
        <a @[click]="onClick" />
      </template>`,
      options: buildOptions({ version: '^2.6.0' })
    },
    {
      code: `
      <template>
        <a :href="'/xxx'" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <a @click="onClick" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <a :[href]="'/xxx'" />
      </template>`,
      options: buildOptions({ version: '^3.0.0' })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <a :[href]="'/xxx'" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: 'Dynamic arguments are not supported until Vue.js "2.6.0".',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <a @[click]="onClick" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: 'Dynamic arguments are not supported until Vue.js "2.6.0".',
          line: 3
        }
      ]
    }
  ]
})
