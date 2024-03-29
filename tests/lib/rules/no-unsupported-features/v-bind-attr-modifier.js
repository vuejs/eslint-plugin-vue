/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../../eslint-compat').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('v-bind-attr-modifier', '^3.1.0')
const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/v-bind-attr-modifier', rule, {
  valid: [
    {
      code: `
      <template>
        <div :foo.attr="foo" />
      </template>`,
      options: buildOptions({ version: '^3.2.0' })
    },
    {
      code: `
      <template>
        <div v-bind:attr="foo" />
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <div :foo.attr="foo" />
      </template>`,
      options: buildOptions({
        version: '^2.5.0',
        ignores: ['v-bind-attr-modifier']
      })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo.attr="foo" />
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`.attr` modifiers on `v-bind` are not supported until Vue.js "3.2.0".',
          line: 3
        }
      ]
    }
  ]
})
