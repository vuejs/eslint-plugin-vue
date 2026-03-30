/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/prefer-import-from-vue'

const tester = new RuleTester({
  languageOptions: {
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
    export { createApp }`,
    {
      filename: 'test.d.ts',
      code: `import '@vue/runtime-dom'`
    }
  ],
  invalid: [
    {
      code: `import { createApp } from '@vue/runtime-dom'`,
      output: `import { createApp } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 45
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
          column: 26,
          endLine: 1,
          endColumn: 45
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
          column: 26,
          endLine: 1,
          endColumn: 43
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
          column: 32,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      code: `import { unknown } from '@vue/reactivity'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      code: `import { unknown } from '@vue/runtime-dom'`,
      output: `import { unknown } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      code: `import * as Foo from '@vue/reactivity'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: `import * as Foo from '@vue/runtime-dom'`,
      output: `import * as Foo from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      code: `export * from '@vue/reactivity'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: `export * from '@vue/runtime-dom'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: `export { computed } from '@vue/reactivity'`,
      output: `export { computed } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      code: `export { computed } from '@vue/runtime-dom'`,
      output: `export { computed } from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      code: `export { unknown } from '@vue/reactivity'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      code: `export { unknown } from '@vue/runtime-dom'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      code: `import unknown from '@vue/reactivity'`,
      output: null,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/reactivity'.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      code: `import unknown from '@vue/runtime-dom'`,
      output: `import unknown from 'vue'`,
      errors: [
        {
          message: "Import from 'vue' instead of '@vue/runtime-dom'.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
})
