/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-restricted-block'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
})

tester.run('no-restricted-block', rule as RuleModule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<style>.foo {}</style>',
      options: ['foo']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<style>.foo {}</style><foo></foo>`,
      options: ['style', 'foo'],
      errors: [
        {
          message: 'Using `<style>` is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 8
        },
        {
          message: 'Using `<foo>` is not allowed.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<forbidden-block></forbidden-block>
      <block-forbidden></block-forbidden>`,
      options: ['/forbidden/'],
      errors: [
        {
          message: 'Using `<forbidden-block>` is not allowed.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 18
        },
        {
          message: 'Using `<block-forbidden>` is not allowed.',
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<style>.foo {}</style>
      <forbidden-block></forbidden-block>
      <block-forbidden></block-forbidden>`,
      options: [
        {
          element: 'style',
          message: 'Do not use <style> block in this project.'
        },
        {
          element: '/forbidden/',
          message: 'Do not use blocks that include `forbidden` in their name.'
        }
      ],
      errors: [
        {
          message: 'Do not use <style> block in this project.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 8
        },
        {
          message: 'Do not use blocks that include `forbidden` in their name.',
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 24
        },
        {
          message: 'Do not use blocks that include `forbidden` in their name.',
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 24
        }
      ]
    }
  ]
})
