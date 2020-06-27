/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-useless-v-bind.js')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
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
      code: `
      <template>
        <div :id="'\\n'" />
        <div :id="'\\r'" />
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
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.'
      ]
    },
    {
      code: `
      <template>
        <div :id="'\\n'" />
        <div :id="'\\r'" />
      </template>`,
      output: null,
      errors: [
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.'
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
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.',
        'Unexpected `v-bind` with a string literal value.'
      ]
    }
  ]
})
