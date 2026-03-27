/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/operator-linebreak'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
})

tester.run('operator-linebreak', rule, {
  valid: [
    `
    <template>
      <div :foo="1 + 2" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="1 + 2" />
      </template>
      `,
      options: ['before']
    },
    {
      code: `
      <template>
        <div :foo="1 + 2" />
      </template>
      `,
      options: ['none']
    },
    `
    <template>
      <div :[foo+bar]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :[foo+bar]="value" />
      </template>
      `,
      options: ['before']
    },
    {
      code: `
      <template>
        <div :[foo+bar]="value" />
      </template>
      `,
      options: ['none']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo="1
          + 2" />
      </template>
      `,
      output: `
      <template>
        <div :foo="1 +
          2" />
      </template>
      `,
      errors: [
        {
          message: "'+' should be placed at the end of the line.",
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 12
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="1 +
          2" />
      </template>
      `,
      output: `
      <template>
        <div :foo="1
          + 2" />
      </template>
      `,
      options: ['before'],
      errors: [
        {
          message: "'+' should be placed at the beginning of the line.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 23
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="1 +
          2" />
        <div :foo="1
          + 2" />
      </template>
      `,
      output: `
      <template>
        <div :foo="1 +          2" />
        <div :foo="1          + 2" />
      </template>
      `,
      options: ['none'],
      errors: [
        {
          message: "There should be no line break before or after '+'.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 23
        },
        {
          message: "There should be no line break before or after '+'.",
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 12
        }
      ]
    }
  ]
})
