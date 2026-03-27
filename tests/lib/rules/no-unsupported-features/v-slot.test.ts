/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import vueESLintParser from 'vue-eslint-parser'
import { RuleTester } from '../../../eslint-compat'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'

const buildOptions = optionsBuilder('v-slot', '^2.5.0')
const tester = new RuleTester({
  languageOptions: { parser: vueESLintParser, ecmaVersion: 2019 }
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
      output: `
      <template>
        <LinkList>
          <template slot ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 27
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
      output: `
      <template>
        <LinkList>
          <template slot="default" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 29
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
      output: `
      <template>
        <LinkList>
          <template slot="name" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 32
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
      output: `
      <template>
        <LinkList>
          <template slot="name" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 26
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
      output: `
      <template>
        <LinkList>
          <template slot-scope="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 27
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
      output: `
      <template>
        <LinkList>
          <template slot="default" slot-scope="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 29
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
      output: `
      <template>
        <LinkList>
          <template slot="name" slot-scope="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 32
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
      output: `
      <template>
        <LinkList>
          <template slot="name" slot-scope="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 26
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
      output: `
      <template>
        <LinkList>
          <template :slot="name" slot-scope="{a}" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 34
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
      output: `
      <template>
        <LinkList>
          <template slot="name" slot-scope="{" ><a /></template>
        </LinkList>
      </template>`,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 32
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
      output: null,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 31
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
      output: null,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 31
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
      output: null,
      options: buildOptions(),
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 25
        }
      ]
    }
  ]
})
