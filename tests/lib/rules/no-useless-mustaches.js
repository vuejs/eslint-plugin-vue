/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-useless-mustaches.js')

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

tester.run('no-useless-mustaches', rule, {
  valid: [
    `
    <template>
      foo
      'foo'
      {{ foo }}
      {{ 'foo'||'bar' }}
      {{ 1 }}
      {{  }}
      {{ . }}
      {{ null }}
    </template>`,
    {
      code: `
      <template>
        {{ 'comment'/*comment*/ }}
        {{ 'comment'//comment
        " }}
      </template>
      `,
      options: [{ ignoreIncludesComment: true }]
    },
    {
      code: `
      <template>
        {{ '\\n' }}
        {{ '\\r' }}
      </template>`,
      options: [{ ignoreStringEscape: true }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
        {{ 'foo' }}
      </template>`,
      output: `
      <template>
        foo
      </template>`,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3
        }
      ]
    },
    {
      code: `
      <template>
        {{ 'comment'/*comment*/ }}
        {{ 'comment'//comment
         }}
      </template>
      `,
      output: null,
      errors: [
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.'
      ]
    },
    {
      code: `
      <template>
        {{ '\\n' }}
        {{ '\\r' }}
      </template>`,
      output: null,
      errors: [
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.'
      ]
    },
    {
      code: `
      <template>
        {{ '&quot;' }}
        {{ \`&quot;&apos;\` }}
        {{ '\\\\' }}
        {{ '\\\\r' }}
        {{ '\\' }}
        {{ \`foo\` }}
        {{ \`foo\${bar}\` }}
        {{ "&apos;" }}
        {{ \`foo\` }}
      </template>`,
      output: `
      <template>
        &quot;
        &quot;&apos;
        \\
        \\r
        {{ '\\' }}
        foo
        {{ \`foo\${bar}\` }}
        &apos;
        foo
      </template>`,
      errors: [
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.'
      ]
    },
    {
      code: `
      <template>
        {{ &apos;msg&apos; }}
        {{ &quot;msg&quot; }}
        {{ &apos;msg' }}
        {{ &quot;msg" }}
        {{ 'msg&apos; }}
        {{ "msg&quot; }}
        {{ &#39;&lt;msg&gt;&apos; }}
        {{ &#34;I&apos;m&#x22; }}
        {{ "no semi&#34 }}
      </template>`,
      output: `
      <template>
        msg
        msg
        msg
        msg
        msg
        msg
        &lt;msg&gt;
        I&apos;m
        {{ "no semi&#34 }}
      </template>`,
      errors: [
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.'
      ]
    },
    {
      code: `
      <template>
        {{ 'I\\'m' }}
        {{ "\\"Happy\\"" }}
        {{ \`backtick \\\` and dollar \\$\` }}
        {{ "\\\\" }}
      </template>`,
      output: `
      <template>
        I'm
        "Happy"
        backtick \` and dollar $
        \\
      </template>`,
      errors: [
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.'
      ]
    },
    {
      code: `
      <template>
        {{ \`foo
bar\` }}
      </template>
      `,
      output: null,
      errors: ['Unexpected mustache interpolation with a string literal value.']
    },
    {
      code: `
      <template>
        {{ 'space ' }}
        {{ ' space' }}
        {{ ' space ' }}
        {{ '  ' }}
      </template>
      `,
      output: null,
      errors: [
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.',
        'Unexpected mustache interpolation with a string literal value.'
      ]
    }
  ]
})
