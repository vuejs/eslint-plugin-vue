/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
/**
 * See to testcases in `./no-unsupported-features` directory for testcases of each features.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unsupported-features')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
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
      options: [{ version: '^2.5.0' }],
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
      errors: [
        {
          message: '`v-slot` are not supported until Vue.js "2.6.0".',
          line: 4
        },
        {
          message: 'Dynamic arguments are not supported until Vue.js "2.6.0".',
          line: 6
        }
      ]
    }
  ]
})
