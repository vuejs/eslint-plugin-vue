/**
 * @author Yosuke Ota
 */
'use strict'

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
    '<script setup></script><script></script>',
    '<docs></docs><template></template><script></script><script setup></script><style></style>',
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
      code: '<script setup></script><script></script><template></template><style></style>',
      output: null,
      options: [
        { order: ['script[setup]', 'script:not([setup])', 'template', 'style'] }
      ]
    },
    {
      code: '<template></template><script setup></script><script></script><style></style>',
      output: null,
      options: [
        {
          order: [['script[setup]', 'script:not([setup])', 'template'], 'style']
        }
      ]
    },
    {
      code: '<script></script><script setup></script><template></template><style></style>',
      output: null,
      options: [{ order: ['script', 'template', 'style'] }]
    },
    {
      code: '<template></template><script></script><script setup></script><style></style>',
      output: null,
      options: [{ order: [['script', 'template'], 'style'] }]
    },
    {
      code: '<script></script><script setup></script><template></template><style></style>',
      output: null,
      options: [
        { order: ['script:not([setup])', 'script[setup]', 'template', 'style'] }
      ]
    },
    {
      code: '<template></template><script></script><script setup></script><style></style>',
      output: null,
      options: [
        {
          order: [['script:not([setup])', 'script[setup]', 'template'], 'style']
        }
      ]
    },
    {
      code: '<template></template><script></script><script setup></script><style scoped></style><style></style><i18n locale="ja"></i18n><i18n locale="en"></i18n>',
      output: null,
      options: [
        {
          order: [
            ['script:not([setup])', 'script[setup]', 'template'],
            'style[scoped]',
            'style:not([scoped])',
            'i18n:not([locale=en])',
            'i18n:not([locale=ja])'
          ]
        }
      ]
    },
    {
      code: '<template></template><script></script><script setup></script><style scoped></style><style></style><i18n locale="en"></i18n><i18n locale="ja"></i18n>',
      output: null,
      options: [
        {
          order: [
            'template',
            'script:not([setup])',
            'script[setup]',
            'style[scoped]',
            'style:not([scoped])',
            'i18n[locale=en]',
            'i18n[locale=ja]'
          ]
        }
      ]
    },
    {
      code: '<template></template><docs></docs><script></script><style></style>',
      output: null,
      options: [{ order: [['docs', 'script', 'template'], 'style'] }]
    },
    {
      code: '<i18n locale="en"></i18n><i18n locale="ja"></i18n>',
      output: null,
      options: [{ order: ['i18n[locale=en]', 'i18n[locale=ja]'] }]
    },
    {
      code: '<style></style><style scoped></style>',
      output: null,
      options: [{ order: ['style:not([scoped])', 'style[scoped]'] }]
    },

    `<script></script><style></style>`,

    // Invalid EOF
    '<template><div a=">test</div></template><style></style>',
    '<template><div><!--test</div></template><style></style>'
  ],
  invalid: [
    {
      code: '<style></style><template></template><script></script>',
      output: '<template></template><style></style><script></script>',
      errors: [
        {
          message: "'<template>' should be above '<style>' on line 1.",
          line: 1,
          column: 16
        },
        {
          message: "'<script>' should be above '<style>' on line 1.",
          line: 1,
          column: 37
        }
      ]
    },
    {
      code: '<template></template><script></script><style></style>',
      output: '<script></script><template></template><style></style>',
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: "'<script>' should be above '<template>' on line 1.",
          line: 1,
          column: 22
        }
      ]
    },
    {
      code: `
        <template></template>

        <style></style>

        <script></script>`,
      output:
        '\n' +
        '        <template></template>\n' +
        '\n' +
        '        <script></script>\n' +
        '\n' +
        '        <style></style>',
      errors: [
        {
          message: "'<script>' should be above '<style>' on line 4.",
          line: 6
        }
      ]
    },
    {
      code: `
        <template></template>
        <script></script>
        <style></style>
      `,
      output:
        '\n' +
        '        <script></script>\n' +
        '        <template></template>\n' +
        '        <style></style>\n' +
        '      ',
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: "'<script>' should be above '<template>' on line 2.",
          line: 3
        }
      ]
    },
    {
      code: `
        <script></script>
        <template></template>
        <style></style>
      `,
      output:
        '\n' +
        '        <template></template>\n' +
        '        <script></script>\n' +
        '        <style></style>\n' +
        '      ',
      options: [{ order: ['template', 'script', 'style'] }],
      errors: [
        {
          message: "'<template>' should be above '<script>' on line 2.",
          line: 3
        }
      ]
    },
    {
      code: `
        <template></template>
        <docs></docs>
        <script></script>
        <style></style>
      `,
      output:
        '\n' +
        '        <docs></docs>\n' +
        '        <template></template>\n' +
        '        <script></script>\n' +
        '        <style></style>\n' +
        '      ',
      options: [{ order: ['docs', 'template', 'script', 'style'] }],
      errors: [
        {
          message: "'<docs>' should be above '<template>' on line 2.",
          line: 3
        }
      ]
    },
    {
      code: `
        <template></template>
        <docs></docs>
        <script></script>
        <style></style>
      `,
      output:
        '\n' +
        '        <script></script>\n' +
        '        <template></template>\n' +
        '        <docs></docs>\n' +
        '        <style></style>\n' +
        '      ',
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: "'<script>' should be above '<template>' on line 2.",
          line: 4
        }
      ]
    },
    {
      code: `
        <template></template>
        <docs>
        </docs>
        <script></script>
        <style></style>
      `,
      output:
        '\n' +
        '        <script></script>\n' +
        '        <template></template>\n' +
        '        <docs>\n' +
        '        </docs>\n' +
        '        <style></style>\n' +
        '      ',
      options: [{ order: ['script', 'template', 'style'] }],
      errors: [
        {
          message: "'<script>' should be above '<template>' on line 2.",
          line: 5
        }
      ]
    },
    {
      code: `
        <script></script>
        <template></template>
      `,
      output:
        '\n        <template></template>\n        <script></script>\n      ',
      options: [{ order: ['template', 'script'] }],
      errors: [
        {
          message: "'<template>' should be above '<script>' on line 2.",
          line: 3
        }
      ]
    },
    {
      code: `
        <style></style>
        <template></template>
        <script></script>
      `,
      output:
        '\n' +
        '        <template></template>\n' +
        '        <style></style>\n' +
        '        <script></script>\n' +
        '      ',
      errors: [
        {
          message: "'<template>' should be above '<style>' on line 2.",
          line: 3
        },
        {
          message: "'<script>' should be above '<style>' on line 2.",
          line: 4
        }
      ]
    },
    {
      code: `
        <style></style>
        <docs></docs>
        <template></template>
        <script></script>
      `,
      output:
        '\n' +
        '        <template></template>\n' +
        '        <style></style>\n' +
        '        <docs></docs>\n' +
        '        <script></script>\n' +
        '      ',
      errors: [
        {
          message: "'<template>' should be above '<style>' on line 2.",
          line: 4
        },
        {
          message: "'<script>' should be above '<style>' on line 2.",
          line: 5
        }
      ]
    },
    // no <template>
    {
      code: `
        <style></style>
        <script></script>
      `,
      output: '\n        <script></script>\n        <style></style>\n      ',
      errors: [
        {
          message: "'<script>' should be above '<style>' on line 2.",
          line: 3
        }
      ]
    },
    {
      code: '<i18n locale="ja"></i18n><i18n locale="en"></i18n>',
      output: '<i18n locale="en"></i18n><i18n locale="ja"></i18n>',
      options: [{ order: ['i18n[locale=en]', 'i18n[locale=ja]'] }],
      errors: [
        {
          message:
            "'<i18n locale=en>' should be above '<i18n locale=ja>' on line 1.",
          line: 1
        }
      ]
    },
    {
      code: '<style scoped></style><style></style>',
      output: '<style></style><style scoped></style>',
      options: [{ order: ['style:not([scoped])', 'style[scoped]'] }],
      errors: [
        {
          message: "'<style>' should be above '<style scoped>' on line 1.",
          line: 1
        }
      ]
    },
    {
      code: '<style></style><style scoped></style>',
      output: '<style scoped></style><style></style>',
      options: [{ order: ['style[scoped]', 'style:not([scoped])'] }],
      errors: [
        {
          message: "'<style scoped>' should be above '<style>' on line 1.",
          line: 1
        }
      ]
    },
    {
      code: '<style></style><script></script>',
      output: '<script></script><style></style>',
      options: [{ order: ['script:not([scoped])', 'style:not([scoped])'] }],
      errors: [
        {
          message: "'<script>' should be above '<style>' on line 1.",
          line: 1
        }
      ]
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
