/**
 * @author Flo Edelmann
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-constant-condition'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 6 }
})

tester.run('no-constant-condition', rule, {
  valid: [
    '<template><CustomButton v-if="a" /></template>',
    '<template><CustomButton v-if="a == 0" /></template>',
    '<template><CustomButton v-if="a == f()" /></template>',
    '<template><CustomButton v-other-directive="true" /></template>'
  ],
  invalid: [
    {
      code: '<template><CustomButton v-if="-2" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: '<template><CustomButton v-else-if="true" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      code: '<template><CustomButton v-if="1" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: '<template><CustomButton v-show="{}" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      code: '<template><CustomButton v-if="0 < 1" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: '<template><CustomButton v-if="0 || 1" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 37
        }
      ]
    },

    {
      code: '<template><CustomButton v-if="`foo`" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: '<template><CustomButton v-if="``" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 33
        }
      ]
    }
  ]
})
