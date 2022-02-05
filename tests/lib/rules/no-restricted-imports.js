/**
 * @author Jackson Hammond
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-imports')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    // sourceType: 'module'
  }
})

tester.run('no-transitive-dependency-imports', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      import { ref } from 'vue'
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { ref, computed } from 'vue'
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { 
        ref 
      } from 'vue'
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { 
        ref,
        computed
      } from 'vue'
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `import { computed } from '@vue/reactivity'`,
      errors: ["Please always import these APIs from the  main 'vue' package"]
    }
  ]
})
