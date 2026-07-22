/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import vueESLintParser from 'vue-eslint-parser'
import { RuleTester } from '../../../eslint-compat'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'

const buildOptions = optionsBuilder('define-slots', '^3.2.0')
const tester = new RuleTester({
  languageOptions: { parser: vueESLintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/define-slots', rule, {
  valid: [
    {
      code: `
      <script setup>
        const slots = defineSlots()
      </script>`,
      options: buildOptions({ version: '^3.3.0' })
    },
    {
      code: `
      <script setup>
        defineProps({})
      </script>`,
      options: buildOptions()
    },
    {
      code: `
      <script setup>
        const slots = defineSlots()
      </script>`,
      options: buildOptions({ version: '^3.0.0', ignores: ['define-slots'] })
    }
  ],
  invalid: [
    {
      code: `
      <script setup>
        const slots = defineSlots()
      </script>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`defineSlots()` macros are not supported until Vue.js "3.3.0".',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 36
        }
      ]
    }
  ]
})
