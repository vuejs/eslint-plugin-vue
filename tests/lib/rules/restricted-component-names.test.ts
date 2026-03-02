/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/restricted-component-names'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('restricted-component-names', rule, {
  valid: [
    '<template><keep-alive></keep-alive></template>',
    '<template><button/></template>',
    {
      filename: 'test.vue',
      code: `
      <template>
        <foo-button/>
        <div-bar/>
      </template>
      `,
      options: [{ allow: ['/^foo-/', '/-bar$/'] }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <Button/>
        <foo-button/>
      </template>
      `,
      errors: [
        {
          messageId: 'invalidName',
          data: { name: 'Button' },
          line: 3
        },
        {
          messageId: 'invalidName',
          data: { name: 'foo-button' },
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <bar-button/>
        <foo/>
      </template>
      `,
      options: [{ allow: ['/^foo-/', 'bar'] }],
      errors: [
        {
          messageId: 'invalidName',
          data: { name: 'bar-button' },
          line: 3
        },
        {
          messageId: 'invalidName',
          data: { name: 'foo' },
          line: 4
        }
      ]
    }
  ]
})
