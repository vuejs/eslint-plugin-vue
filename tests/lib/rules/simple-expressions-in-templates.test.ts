/**
 * @author Piet Maier
 */

'use strict'

import vueESLintParser from 'vue-eslint-parser'
import rule from '../../../lib/rules/simple-expressions-in-templates'
import { RuleTester } from '../../eslint-compat'

const tester = new RuleTester({
  languageOptions: {
    parser: vueESLintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('simple-expressions-in-templates', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template></template>
      `,
      name: 'Empty Template'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ normalizedFullName }}
      </template>
      `,
      name: 'Valid Style Guide Example'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        {{
          fullName
            .split(' ')
            .map((word) => {
              return word[0].toUpperCase() + word.slice(1)
            })
            .join(' ')
        }}
      </template>
      `,
      errors: [
        {
          message:
            'Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.',
          line: 3,
          column: 9,
          endLine: 10,
          endColumn: 11
        }
      ],
      name: 'Invalid Style Guide Example'
    }
  ]
})
