/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
/**
 * See to testcases in `./no-unsupported-features` directory for testcases of each features.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-unsupported-features'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features', rule, {
  valid: [
    {
      code: `
      <template>
        <VList>
          <template v-slot:name>
            <a
              :[href]="'/xxx'"
            />
          </template>
        </VList>
      </template>`,
      options: [{ version: '^2.6.0' }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <VList>
          <template v-slot:name>
            <a
              :[href]="'/xxx'"
            />
          </template>
        </VList>
      </template>`,
      output: `
      <template>
        <VList>
          <template slot="name">
            <a
              :[href]="'/xxx'"
            />
          </template>
        </VList>
      </template>`,
      options: [{ version: '^2.5.0' }],
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 32
        },
        {
          message: 'Dynamic arguments are not supported until Vue.js "2.6.0".',
          line: 6,
          column: 16,
          endLine: 6,
          endColumn: 22
        }
      ]
    }
  ]
})
