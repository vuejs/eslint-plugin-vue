/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../../eslint-compat.ts'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'
import vueEslintParser from 'vue-eslint-parser'

const buildOptions = optionsBuilder('define-model', '^3.3.0')
const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2019 }
})

tester.run('no-unsupported-features/define-model', rule, {
  valid: [
    {
      code: `
      <script setup>
        const model = defineModel()
      </script>`,
      options: buildOptions({ version: '^3.4.0' })
    },
    {
      code: `
      <script setup>
        defineSlots({})
      </script>`,
      options: buildOptions()
    },
    {
      code: `
      <script setup>
        const model = defineModel()
      </script>`,
      options: buildOptions({ version: '^3.3.0', ignores: ['define-model'] })
    }
  ],
  invalid: [
    {
      code: `
      <script setup>
        const model = defineModel()
      </script>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`defineModel()` macros are not supported until Vue.js "3.4.0".',
          line: 3
        }
      ]
    }
  ]
})
