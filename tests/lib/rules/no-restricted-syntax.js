/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-syntax')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-restricted-syntax', rule, {
  valid: [
    {
      code: `
        <template>
          <input :value="value">
        </template>`,
      options: [
        {
          'selector': 'CallExpression',
          'message': 'Call expressions are not allowed.'
        }
      ]
    },
    {
      code: `
        <template>
          <input :[value]="value">
        </template>`,
      options: [
        {
          'selector': 'CallExpression',
          'message': 'Call expressions are not allowed.'
        }
      ]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <input :value="value()">
        </template>`,
      options: [
        {
          'selector': 'CallExpression',
          'message': 'Call expressions are not allowed.'
        }
      ],
      errors: [
        {
          message: 'Call expressions are not allowed.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 33
        }
      ]
    },

    // Forbids call expressions inside mustache interpolation.
    {
      code: `
        <template>
          <div> {{ foo() }} </div>
          <div> {{ foo.bar() }} </div>
          <div> {{ foo().bar }} </div>
        </template>`,
      options: [
        {
          'selector': 'VElement > VExpressionContainer CallExpression',
          'message': 'Call expressions are not allowed inside mustache interpolation.'
        }
      ],
      errors: [
        {
          message: 'Call expressions are not allowed inside mustache interpolation.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 25
        },
        {
          message: 'Call expressions are not allowed inside mustache interpolation.',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 29
        },
        {
          message: 'Call expressions are not allowed inside mustache interpolation.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 25
        }
      ]
    },

    // Sample source code on issue 689
    {
      code: `
      <template>
        <div :foo="$gettext(\`bar\`)">{{$gettext(\`bar\`)}}</div>
      </template>`,
      options: [
        "CallExpression[callee.type='Identifier'][callee.name='$gettext'] TemplateLiteral"
      ],
      errors: [
        {
          message: 'Using \'CallExpression[callee.type=\'Identifier\'][callee.name=\'$gettext\'] TemplateLiteral\' is not allowed.',
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 34
        },
        {
          message: 'Using \'CallExpression[callee.type=\'Identifier\'][callee.name=\'$gettext\'] TemplateLiteral\' is not allowed.',
          line: 3,
          column: 48,
          endLine: 3,
          endColumn: 53
        }
      ]
    },

    {
      code: `
        <template>
          <input :[fn()]="fn()">
        </template>`,
      options: [
        {
          'selector': 'CallExpression',
          'message': 'Call expressions are not allowed.'
        }
      ],
      errors: ['Call expressions are not allowed.', 'Call expressions are not allowed.']
    }
  ]
})
