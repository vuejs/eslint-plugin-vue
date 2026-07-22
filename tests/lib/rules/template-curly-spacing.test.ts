/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/template-curly-spacing'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
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
    },

    // CSS vars injection
    `
      <style>
      .text {
        padding: v-bind(\`\${a}px\`)
      }
      </style>
    `
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
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 31
        },
        {
          message: "Unexpected space(s) before '}'.",
          line: 3,
          column: 34,
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      code: `
      <template>
        <div :class="[\`foo-\${bar}\`]" />
      </template>
      `,
      output: `
      <template>
        <div :class="[\`foo-\${ bar }\`]" />
      </template>
      `,
      options: ['always'],
      errors: [
        {
          message: "Expected space(s) after '${'.",
          line: 3,
          column: 28,
          endLine: 3,
          endColumn: 30
        },
        {
          message: "Expected space(s) before '}'.",
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 34
        }
      ]
    },

    // CSS vars injection
    {
      code: `
      <style>
      .text {
        padding: v-bind(\`\${ a }px\`)
      }
      </style>`,
      output: `
      <style>
      .text {
        padding: v-bind(\`\${a}px\`)
      }
      </style>`,
      errors: [
        {
          message: "Unexpected space(s) after '${'.",
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 29
        },
        {
          message: "Unexpected space(s) before '}'.",
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 31
        }
      ]
    }
  ]
})
