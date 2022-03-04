/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/component-tags-order')
const RuleTester = require('eslint').RuleTester
const assert = require('assert')
const { ESLint } = require('../../eslint-compat')

// Initialize linter.
const eslint = new ESLint({
  overrideConfig: {
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: {
      ecmaVersion: 2015
    },
    plugins: ['vue'],
    rules: {
      'vue/comment-directive': 'error',
      'vue/component-tags-order': 'error'
    }
  },
  useEslintrc: false,
  plugins: { vue: require('../../../lib/index') },
  fix: true
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser')
})

tester.run('component-tags-order', rule, {
  valid: [
    // default
    '<script></script><template></template><style></style>',
    '<template></template><script></script><style></style>',
    '<script> /*script*/ </script><template><div id="id">text <!--comment--> </div><br></template><style>.button{ color: red; }</style>',
    '<docs></docs><script></script><template></template><style></style>',
    '<script></script><docs></docs><template></template><style></style>',
    '<docs></docs><template></template><script></script><style></style>',
    '<template></template><script></script><docs></docs><style></style>',
    '<script></script><template></template>',
    '<template></template><script></script>',
    `
      <template>
      </template>

      <script>
      </script>

      <style>
      </style>
    `,
    `
      <script>
      </script>

      <template>
      </template>

      <style>
      </style>
    `,

    // order
    {
      code: '<script></script><template></template><style></style>',
      output: null,
      options: [{ order: ['script', 'template', 'style'] }]
    },
    {
      code: '<template></template><script></script><style></style>',
      output: null,
      options: [{ order: ['template', 'script', 'style'] }]
    },
    {
      code: '<style></style><template></template><script></script>',
      output: null,
      options: [{ order: ['style', 'template', 'script'] }]
    },
    {
      code: '<template></template><script></script><style></style>',
      output: null,
      options: [{ order: ['template', 'docs', 'script', 'style'] }]
    },
    {
      code: '<template></template><docs></docs><script></script><style></style>',
      output: null,
      options: [{ order: ['template', 'script', 'style'] }]
    },
    {
      code: '<docs><div id="id">text <!--comment--> </div><br></docs><script></script><template></template><style></style>',
      output: null,
      options: [{ order: ['docs', 'script', 'template', 'style'] }]
    },
    {
      code: '<template></template><docs></docs><script></script><style></style>',
      output: null,
      options: [{ order: [['docs', 'script', 'template'], 'style'] }]
    },

    `<script></script><style></style>`,

    // Invalid EOF
    '<template><div a=">test</div></template><style></style>',
    '<template><div><!--test</div></template><style></style>'
  ],
  invalid: [
    {
      code: '<style></style><template></template><script></script>',
      errors: [
        {
          message: 'The <template> should be above the <style> on line 1.',
          line: 1,
          column: 16
        },
        {
          message: 'The <script> should be above the <style> on line 1.',
          line: 1,
          column: 37
        }
      ],
      output: '<template></template><style></style><script></script>'
    },
    {
      code: '<template></template><script></script><style></style>',
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: 'The <script> should be above the <template> on line 1.',
          line: 1,
          column: 22
        }
      ],
      output: '<script></script><template></template><style></style>'
    },
    {
      code: `
        <template></template>

        <style></style>

        <script></script>`,
      errors: [
        {
          message: 'The <script> should be above the <style> on line 4.',
          line: 6
        }
      ],
      output:
        '\n' +
        '        <template></template>\n' +
        '\n' +
        '        <script></script>\n' +
        '\n' +
        '        <style></style>'
    },
    {
      code: `
        <template></template>
        <script></script>
        <style></style>
      `,
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: 'The <script> should be above the <template> on line 2.',
          line: 3
        }
      ],
      output:
        '\n' +
        '        <script></script>\n' +
        '        <template></template>\n' +
        '        <style></style>\n' +
        '      '
    },
    {
      code: `
        <script></script>
        <template></template>
        <style></style>
      `,
      options: [{ order: ['template', 'script', 'style'] }],
      errors: [
        {
          message: 'The <template> should be above the <script> on line 2.',
          line: 3
        }
      ],
      output:
        '\n' +
        '        <template></template>\n' +
        '        <script></script>\n' +
        '        <style></style>\n' +
        '      '
    },
    {
      code: `
        <template></template>
        <docs></docs>
        <script></script>
        <style></style>
      `,
      options: [{ order: ['docs', 'template', 'script', 'style'] }],
      errors: [
        {
          message: 'The <docs> should be above the <template> on line 2.',
          line: 3
        }
      ],
      output:
        '\n' +
        '        <docs></docs>\n' +
        '        <template></template>\n' +
        '        <script></script>\n' +
        '        <style></style>\n' +
        '      '
    },
    {
      code: `
        <template></template>
        <docs></docs>
        <script></script>
        <style></style>
      `,
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: 'The <script> should be above the <template> on line 2.',
          line: 4
        }
      ],
      output:
        '\n' +
        '        <script></script>\n' +
        '        <template></template>\n' +
        '        <docs></docs>\n' +
        '        <style></style>\n' +
        '      '
    },
    {
      code: `
        <template></template>
        <docs>
        </docs>
        <script></script>
        <style></style>
      `,
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: 'The <script> should be above the <template> on line 2.',
          line: 5
        }
      ],
      output:
        '\n' +
        '        <script></script>\n' +
        '        <template></template>\n' +
        '        <docs>\n' +
        '        </docs>\n' +
        '        <style></style>\n' +
        '      '
    },
    {
      code: `
        <script></script>
        <template></template>
      `,
      options: [{ order: ['template', 'script'] }],
      errors: [
        {
          message: 'The <template> should be above the <script> on line 2.',
          line: 3
        }
      ],
      output:
        '\n        <template></template>\n        <script></script>\n      '
    },
    {
      code: `
        <style></style>
        <template></template>
        <script></script>
      `,
      errors: [
        {
          message: 'The <template> should be above the <style> on line 2.',
          line: 3
        },
        {
          message: 'The <script> should be above the <style> on line 2.',
          line: 4
        }
      ],
      output:
        '\n' +
        '        <template></template>\n' +
        '        <style></style>\n' +
        '        <script></script>\n' +
        '      '
    },
    {
      code: `
        <style></style>
        <docs></docs>
        <template></template>
        <script></script>
      `,
      errors: [
        {
          message: 'The <template> should be above the <style> on line 2.',
          line: 4
        },
        {
          message: 'The <script> should be above the <style> on line 2.',
          line: 5
        }
      ],
      output:
        '\n' +
        '        <template></template>\n' +
        '        <style></style>\n' +
        '        <docs></docs>\n' +
        '        <script></script>\n' +
        '      '
    },
    // no <template>
    {
      code: `
        <style></style>
        <script></script>
      `,
      errors: [
        {
          message: 'The <script> should be above the <style> on line 2.',
          line: 3
        }
      ],
      output: '\n        <script></script>\n        <style></style>\n      '
    }
  ]
})

describe('suppress reporting with eslint-disable-next-line', () => {
  it('do not report if <!-- eslint-disable-next-line -->', async () => {
    const code = `<style></style><template></template>
    <!-- eslint-disable-next-line vue/component-tags-order -->
    <script></script>`
    const [{ messages, output }] = await eslint.lintText(code, {
      filePath: 'test.vue'
    })
    assert.strictEqual(messages.length, 0)
    // should not fix <script>
    assert.strictEqual(
      output,
      `<template></template><style></style>
    <!-- eslint-disable-next-line vue/component-tags-order -->
    <script></script>`
    )
  })
})
