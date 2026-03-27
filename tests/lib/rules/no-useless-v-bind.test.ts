/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-useless-v-bind'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-useless-v-bind', rule, {
  valid: [
    `
    <template>
      <div id="foo" />
      <div id='foo' />
      <div id=foo />
      <div :id="foo" />
      <div :id="'foo' || 'bar'" />
      <div :id="1" />
      <div :id />
      <div :id="{" />
      <div :id="null" />
    </template>`,
    {
      code: `
      <template>
        <div :id="'comment'/*comment*/" />
        <div :id="'comment'//comment
        " />
      </template>
      `,
      options: [{ ignoreIncludesComment: true }]
    },
    {
      code: String.raw`
      <template>
        <div :id="'\n'" />
        <div :id="'\r'" />
      </template>`,
      options: [{ ignoreStringEscape: true }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :id="'foo'" />
        <div v-bind:id="'foo'" />
      </template>`,
      output: `
      <template>
        <div id="foo" />
        <div id="foo" />
      </template>`,
      errors: [
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 25
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 31
        }
      ]
    },
    {
      code: `
      <template>
        <div :id="'comment'/*comment*/" />
        <div :id="'comment'//comment
        " />
      </template>
      `,
      output: null,
      errors: [
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 40
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 4,
          column: 14,
          endLine: 5,
          endColumn: 10
        }
      ]
    },
    {
      code: String.raw`
      <template>
        <div :id="'\n'" />
        <div :id="'\r'" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 24
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 24
        }
      ]
    },
    {
      code: `
      <template>
        <div :id="'&quot;'" />
        <div :id=\`&quot;&apos;\` />
        <div :id="'\\\\'" />
        <div :id="'\\\\r'" />
        <div :id="'\\'" />
        <div :id="\`foo\`" />
        <div :id="\`foo\${bar}\`" />
        <div :id='"&apos;"' />
        <div :id=\`foo\` />
      </template>`,
      output: `
      <template>
        <div id="&quot;" />
        <div id=&quot;&apos; />
        <div id="\\" />
        <div id="\\r" />
        <div :id="'\\'" />
        <div id="foo" />
        <div :id="\`foo\${bar}\`" />
        <div id='&apos;' />
        <div id=foo />
      </template>`,
      errors: [
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 28
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 32
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 5,
          column: 14,
          endLine: 5,
          endColumn: 24
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 25
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 8,
          column: 14,
          endLine: 8,
          endColumn: 25
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 10,
          column: 14,
          endLine: 10,
          endColumn: 28
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 11,
          column: 14,
          endLine: 11,
          endColumn: 23
        }
      ]
    },
    {
      code: `
      <template>
        <div :id="    'foo'    " />
        <div :id='    "foo"    ' />
        <div :id="   \`foo\`   " />
        <div :id='   \`foo\`   ' />
        <div :id="' \\'foo\\' '" />
        <div :id='" \\"foo\\" "' />
      </template>`,
      output: `
      <template>
        <div id="foo" />
        <div id='foo' />
        <div id="foo" />
        <div id='foo' />
        <div id=" 'foo' " />
        <div id=' "foo" ' />
      </template>`,
      errors: [
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 33
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 33
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 5,
          column: 14,
          endLine: 5,
          endColumn: 31
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 31
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 31
        },
        {
          message: 'Unexpected `v-bind` with a string literal value.',
          line: 8,
          column: 14,
          endLine: 8,
          endColumn: 31
        }
      ]
    }
  ]
})
