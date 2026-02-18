/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../../eslint-compat.ts'
import rule from '../../../../lib/rules/no-unsupported-features'
import { optionsBuilder } from './utils.ts'
import vueEslintParser from 'vue-eslint-parser'

const buildOptions = optionsBuilder('define-options', '^3.2.0')
const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})

tester.run('no-unsupported-features/define-options', rule, {
  valid: [
    {
      code: `
      <script setup>
        defineOptions({})
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
        defineOptions({})
      </script>`,
      options: buildOptions({ version: '^3.0.0', ignores: ['define-options'] })
    }
  ],
  invalid: [
    {
      code: `
      <script setup>
        defineOptions({ name: 'Foo' })
      </script>`,
      output: `
      <script>
export default { name: 'Foo' }
</script>
<script setup>

      </script>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`defineOptions()` macros are not supported until Vue.js "3.3.0".',
          line: 3
        }
      ]
    },
    {
      code: `
      <script setup>
        defineOptions({});
      </script>`,
      output: `
      <script>
export default {}
</script>
<script setup>

      </script>`,
      options: buildOptions(),
      errors: [
        {
          message:
            '`defineOptions()` macros are not supported until Vue.js "3.3.0".',
          line: 3
        }
      ]
    }
  ]
})
