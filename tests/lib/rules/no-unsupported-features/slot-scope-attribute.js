/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('slot-scope-attribute', '^2.4.0')
const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/slot-scope-attribute', rule, {
  valid: [
    {
      code: `
      <template>
        <LinkList>
          <a slot-scope="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions({ version: '^2.5.0' })
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot=name />
        </LinkList>
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-slot="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot-scope="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions({
        version: '^2.4.0',
        ignores: ['slot-scope-attribute']
      })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <LinkList>
          <a slot-scope />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: null,
      errors: [
        {
          message:
            '`slot-scope` are not supported except Vue.js ">=2.5.0 <3.0.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot-scope="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: null,
      errors: [
        {
          message:
            '`slot-scope` are not supported except Vue.js ">=2.5.0 <3.0.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot-scope />
        </LinkList>
      </template>`,
      options: buildOptions({ version: '^3.0.0' }),
      output: null,
      errors: [
        {
          message:
            '`slot-scope` are not supported except Vue.js ">=2.5.0 <3.0.0".',
          line: 4
        }
      ]
    }
  ]
})
