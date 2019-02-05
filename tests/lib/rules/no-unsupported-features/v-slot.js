/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../../lib/rules/no-unsupported-features')
const utils = require('./utils')

const buildOptions = utils.optionsBuilder('v-slot', '^2.5.0')
const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-unsupported-features/v-slot', rule, {
  valid: [
    {
      code: `
      <template>
        <LinkList>
          <a v-slot:name />
        </LinkList>
      </template>`,
      options: buildOptions({ version: '^2.6.0' })
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
          <a slot-scope="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions()
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-slot:name />
        </LinkList>
      </template>`,
      options: buildOptions({ version: '^2.5.0', ignores: ['v-slot'] })
    },
    {
      code: `
      <template>
        <LinkList>
          <a />
        </LinkList>
      </template>`,
      options: buildOptions({ version: '>=2.0.0' })
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-slot:name />
        </LinkList>
      </template>`,
      options: buildOptions({ version: '2.6.0-beta.2' })
    }
  ],
  invalid: [

    {
      code: `
      <template>
        <LinkList>
          <a v-slot />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a #default />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="default" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-slot:name />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="name" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a #name />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="name" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-slot="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot-scope="{a}" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a #default="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="default" slot-scope="{a}" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a v-slot:name="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="name" slot-scope="{a}" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a #name="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="name" slot-scope="{a}" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },
    // syntax error
    {
      code: `
      <template>
        <LinkList>
          <a v-slot:name="{" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <a slot="name" slot-scope="{" />
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    },

    // unknown modifiers
    {
      code: `
      <template>
        <LinkList>
          <a v-slot.mod="{a}" />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: null,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        }
      ]
    }
  ]
})
