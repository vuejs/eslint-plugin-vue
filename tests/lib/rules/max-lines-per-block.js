/**
 * @author lsdsjy
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/max-lines-per-block')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('max-lines-per-block', rule, {
  valid: [
    {
      code: `
      <script>
        console.log(1)
      </script>
      <template>
        <div></div>
      </template>
      `,
      options: [{ template: 1 }]
    },
    {
      code: `
      <template>

        <div></div>
      </template>
      `,
      options: [{ template: 1, skipBlankLines: true }]
    },
    {
      code: `
      <template>
        <div>
        </div>
      </template>
      `,
      options: [{ script: 1, style: 1 }]
    }
  ],
  invalid: [
    {
      code: `
      <template>

        <div></div>
      </template>
      `,
      options: [{ template: 1 }],
      errors: [
        {
          message: 'Block has too many lines (2). Maximum allowed is 1.',
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: `
      <script>

        const a = 1
        console.log(a)
      </script>
      `,
      options: [{ script: 1, skipBlankLines: true }],
      errors: [
        {
          message: 'Block has too many lines (2). Maximum allowed is 1.',
          line: 2,
          column: 7
        }
      ]
    }
  ]
})
