/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-undef-components-in-script-setup')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-undef-components-in-script-setup', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        import Foo from './Foo.vue'
      </script>

      <template>
        <Foo />
        <Teleport />
        <template v-if="foo"></template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        import FooPascalCase from './component.vue'
        import BarPascalCase from './component.vue'
        import BazPascalCase from './component.vue'
      </script>

      <template>
        <FooPascalCase />
        <bar-pascal-case />
        <bazPascalCase />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import fooCamelCase from './component.vue'
      import barCamelCase from './component.vue'
      </script>

      <template>
        <fooCamelCase />
        <bar-camel-case />
      </template>
      `
    },
    // namespace
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import * as Form from './form-components'
      </script>

      <template>
        <Form.Input>
          <Form.Label>label</Form.Label>
        </Form.Input>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import Bar from './Bar.vue'
      </script>

      <template>
        <Foo />
      </template>
      `,
      options: [{ ignorePatterns: ['Foo'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import Bar from './Bar.vue'
      </script>

      <template>
        <CustomComponent />
      </template>
      `,
      options: [
        {
          ignorePatterns: ['custom(\\-\\w+)+']
        }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import Bar from './Bar.vue'
      </script>

      <template>
        <Foo />
      </template>
      `,
      errors: [
        {
          message:
            "The '<Foo>' component has been used, but not defined in <script setup>.",
          line: 7,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import PascalCase from './component.vue'
      </script>

      <template>
        <pascal_case />
      </template>
      `,
      errors: [
        {
          message:
            "The '<pascal_case>' component has been used, but not defined in <script setup>.",
          line: 7,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import * as Form from './form-components'
      </script>

      <template>
        <Foo.Input />
      </template>
      `,
      errors: [
        {
          message:
            "The '<Foo.Input>' component has been used, but not defined in <script setup>.",
          line: 7,
          column: 9
        }
      ]
    }
  ]
})
