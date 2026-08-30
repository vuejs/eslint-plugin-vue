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
      <template>{{ }}</template>
      `,
      name: 'Empty Mustache Interpolation'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ normalizedFullName }}
      </template>
      `,
      name: 'Valid Style Guide Example'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test() }}
      </template>
      `,
      name: 'CallExpression with Identifier as Callee'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test.test() }}
      </template>
      `,
      name: 'CallExpression with MemberExpression as Callee'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test(' ') }}
      </template>
      `,
      name: 'CallExpression with Literal as Argument'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test(() => {}) }}
      </template>
      `,
      name: 'CallExpression with ArrowFunctionExpression as Argument'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ normalizedFullName }}
      </template>
      `,
      options: [0],
      name: 'Valid Style Guide Example with Complexity 0'
    },
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
      options: [5],
      name: 'Invalid Style Guide Example with Complexity 5'
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
          message: rule.meta.messages.simpleExpressions,
          line: 4,
          column: 11,
          endLine: 9,
          endColumn: 23
        }
      ],
      name: 'Invalid Style Guide Example'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test()() }}
      </template>
      `,
      errors: [
        {
          message: rule.meta.messages.simpleExpressions,
          line: 3,
          column: 12,
          endLine: 3,
          endColumn: 20
        }
      ],
      name: 'CallExpression with CallExpression as Callee'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test(test()) }}
      </template>
      `,
      errors: [
        {
          message: rule.meta.messages.simpleExpressions,
          line: 3,
          column: 12,
          endLine: 3,
          endColumn: 24
        }
      ],
      name: 'CallExpression with CallExpression as Argument'
    },
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
      options: [4],
      errors: [
        {
          message: rule.meta.messages.simpleExpressions,
          line: 4,
          column: 11,
          endLine: 9,
          endColumn: 23
        }
      ],
      name: 'Invalid Style Guide Example with Complexity 4'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ test() }}
      </template>
      `,
      options: [0],
      errors: [
        {
          message: rule.meta.messages.simpleExpressions,
          line: 3,
          column: 12,
          endLine: 3,
          endColumn: 18
        }
      ],
      name: 'CallExpression with Complexity 0'
    }
  ]
})
