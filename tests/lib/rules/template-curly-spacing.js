/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/template-curly-spacing')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('template-curly-spacing', rule, {
  valid: [
    `
    <template>
      <div :class="[\`foo-\${bar}\`]" />
    </template>
    `,
    `
    <template>
      <div :[\`foo\${bar}\`]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :class="[\`foo-\${ bar }\`]" />
      </template>
      `,
      options: ['always']
    },
    {
      code: `
      <template>
        <div :[\`foo\${bar}\`]="value" />
      </template>
      `,
      options: ['always']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :class="[\`foo-\${ bar }\`]" />
      </template>
      `,
      output: `
      <template>
        <div :class="[\`foo-\${bar}\`]" />
      </template>
      `,
      errors: [
        {
          message: "Unexpected space(s) after '${'.",
          line: 3
        },
        {
          message: "Unexpected space(s) before '}'.",
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :class="[\`foo-\${bar}\`]" />
      </template>
      `,
      options: ['always'],
      output: `
      <template>
        <div :class="[\`foo-\${ bar }\`]" />
      </template>
      `,
      errors: [
        {
          message: "Expected space(s) after '${'.",
          line: 3
        },
        {
          message: "Expected space(s) before '}'.",
          line: 3
        }
      ]
    }
  ]
})
