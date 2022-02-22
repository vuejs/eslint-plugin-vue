/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-import-from-vue')

const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-import-from-vue', rule, {
  valid: [
    `import { createApp } from 'vue'`,
    `import { ref, reactive } from '@vue/composition-api'`,
    `export { createApp } from 'vue'`,
    `export * from 'vue'`,
    `import Foo from 'foo'`,
    `import { createApp } from 'vue'
    export { createApp }`
  ],
  invalid: [
    {
      code: `import { createApp } from '@vue/runtime-dom'`,
      output: `import { createApp } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 27
        }
      ]
    },
    {
      code: `import { computed } from '@vue/runtime-core'`,
      output: `import { computed } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-core'.",
          line: 1,
          column: 26
        }
      ]
    },
    {
      code: `import { computed } from '@vue/reactivity'`,
      output: `import { computed } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 26
        }
      ]
    },
    {
      code: `import { normalizeClass } from '@vue/shared'`,
      output: `import { normalizeClass } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/shared'.",
          line: 1,
          column: 32
        }
      ]
    },
    {
      code: `import { unknown } from '@vue/reactivity'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/reactivity'."]
    },
    {
      code: `import { unknown } from '@vue/runtime-dom'`,
      output: `import { unknown } from 'vue'`,
      errors: ["Import from 'vue' instead of '@vue/runtime-dom'."]
    },
    {
      code: `import * as Foo from '@vue/reactivity'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/reactivity'."]
    },
    {
      code: `import * as Foo from '@vue/runtime-dom'`,
      output: `import * as Foo from 'vue'`,
      errors: ["Import from 'vue' instead of '@vue/runtime-dom'."]
    },
    {
      code: `export * from '@vue/reactivity'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/reactivity'."]
    },
    {
      code: `export * from '@vue/runtime-dom'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/runtime-dom'."]
    },
    {
      code: `export { computed } from '@vue/reactivity'`,
      output: `export { computed } from 'vue'`,
      errors: ["Import from 'vue' instead of '@vue/reactivity'."]
    },
    {
      code: `export { computed } from '@vue/runtime-dom'`,
      output: `export { computed } from 'vue'`,
      errors: ["Import from 'vue' instead of '@vue/runtime-dom'."]
    },
    {
      code: `export { unknown } from '@vue/reactivity'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/reactivity'."]
    },
    {
      code: `export { unknown } from '@vue/runtime-dom'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/runtime-dom'."]
    },
    {
      code: `import unknown from '@vue/reactivity'`,
      output: null,
      errors: ["Import from 'vue' instead of '@vue/reactivity'."]
    },
    {
      code: `import unknown from '@vue/runtime-dom'`,
      output: `import unknown from 'vue'`,
      errors: ["Import from 'vue' instead of '@vue/runtime-dom'."]
    }
  ]
})
