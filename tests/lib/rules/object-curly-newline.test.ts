/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/object-curly-newline'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
})

tester.run('object-curly-newline', rule, {
  valid: [
    `
    <template>
      <div :foo="{a: 1}" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      options: ['never']
    },
    `
    <template>
      <div :foo="{
        a: 1
      }" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="{
          a: 1
        }" />
      </template>
      `,
      options: ['always']
    },
    `
    <template>
      <div :[{a:1}]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :[{a:1}]="value" />
      </template>
      `,
      options: ['always']
    },
    {
      code: `
      <template>
        <div :[{a:1}]="value" />
      </template>
      `,
      options: ['never']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo="{a: 1
        }" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected line break before this closing brace.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 10
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="{
          a: 1}" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected line break after this opening brace.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 21
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{
a: 1
}" />
      </template>
      `,
      options: ['always'],
      errors: [
        {
          message: 'Expected a line break after this opening brace.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'Expected a line break before this closing brace.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 26
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="{
          a: 1
        }" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      options: ['never'],
      errors: [
        {
          message: 'Unexpected line break after this opening brace.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'Unexpected line break before this closing brace.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 10
        }
      ]
    }
  ]
})
