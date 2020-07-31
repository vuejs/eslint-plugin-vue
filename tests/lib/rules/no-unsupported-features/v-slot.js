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
  parser: require.resolve('vue-eslint-parser'),
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
          <template v-slot:name ><a /></template>
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
          <template v-slot:name ><a /></template>
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
          <template v-slot:name ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions({ version: '^3.0.0' })
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <LinkList>
          <template v-slot ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot ><a /></template>
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
          <template #default ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="default" ><a /></template>
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
          <template v-slot:name ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="name" ><a /></template>
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
          <template #name ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="name" ><a /></template>
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
          <template v-slot="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot-scope="{a}" ><a /></template>
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
          <template #default="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="default" slot-scope="{a}" ><a /></template>
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
          <template v-slot:name="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="name" slot-scope="{a}" ><a /></template>
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
          <template #name="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="name" slot-scope="{a}" ><a /></template>
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
          <template v-slot:[name]="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template :slot="name" slot-scope="{a}" ><a /></template>
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
          <template v-slot:name="{" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: `
      <template>
        <LinkList>
          <template slot="name" slot-scope="{" ><a /></template>
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
          <template v-slot:[.]="{a}" ><a /></template>
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
    },

    // unknown modifiers
    {
      code: `
      <template>
        <LinkList>
          <template v-slot.mod="{a}" ><a /></template>
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
    },

    // cannot fix
    {
      code: `
      <template>
        <LinkList v-slot="{a}">
          <a />
        </LinkList>
      </template>`,
      options: buildOptions(),
      output: null,
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 3
        }
      ]
    }
  ]
})
