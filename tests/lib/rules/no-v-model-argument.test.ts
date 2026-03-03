/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview This rule checks whether v-model used on custom component do not have an argument
 */
import rule from '../../../lib/rules/no-v-model-argument'
import { RuleTester } from '../../eslint-compat'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

ruleTester.run('no-v-model-argument', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="bar"></MyComponent></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:foo="bar"></MyComponent></template>',
      errors: ["'v-model' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:foo.trim="bar"></MyComponent></template>',
      errors: ["'v-model' directives require no argument."]
    }
  ]
})
