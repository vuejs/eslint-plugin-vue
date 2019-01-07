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
          <button @click="() => onClick()">
            BUTTON
          </button>
        </template>`,
      options: [
        {
          'selector': 'FunctionExpression',
          'message': 'Function expressions are not allowed.'
        }
      ]
    }
  ],
  invalid: [
    {
      code: `
        <template>
          <button @click="function() { onClick() }">
            BUTTON
          </button>
        </template>`,
      options: [
        {
          'selector': 'FunctionExpression',
          'message': 'Function expressions are not allowed.'
        }
      ],
      errors: [
        {
          message: 'Function expressions are not allowed.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 51
        }
      ]
    },

    // Forbind function expressions on `v-on`
    {
      code: `
        <template>
          <button
            :click="function() { onClick() }"
            @click="function() { onClick() }"
            @keydown="() => {
              (function() { onClick() })()
            }">
            BUTTON
          </button>
        </template>`,
      options: [
        {
          'selector': "VAttribute[directive=true][key.name='on'] > VExpressionContainer > FunctionExpression",
          'message': 'Function expressions are not allowed on `v-on`.'
        }
      ],
      errors: [
        {
          message: 'Function expressions are not allowed on `v-on`.',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 45
        }
      ]
    },

    // Forbind call expressions on mustache interpolation
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
          'message': 'Call expressions are not allowed on mustache interpolation.'
        }
      ],
      errors: [
        {
          message: 'Call expressions are not allowed on mustache interpolation.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 25
        },
        {
          message: 'Call expressions are not allowed on mustache interpolation.',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 29
        },
        {
          message: 'Call expressions are not allowed on mustache interpolation.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 25
        }
      ]
    },

    // Sample written on issue 689
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
    }
  ]
})
