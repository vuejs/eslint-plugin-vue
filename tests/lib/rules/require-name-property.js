/**
 * @fileoverview Require a name property in Vue components
 * @author LukeeeeBennett
 */
'use strict'

const rule = require('../../../lib/rules/require-name-property')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('require-name-property', rule, {
  valid: [
    {
      filename: 'ValidComponent.vue',
      code: `
        export default {
          name: 'IssaName'
        }
      `,
      parserOptions
    },
    {
      filename: 'ValidComponent.vue',
      code: `
        export default {
          name: undefined
        }
      `,
      parserOptions
    },
    {
      filename: 'ValidComponent.vue',
      code: `
        export default {
          name: ''
        }
      `,
      parserOptions
    },
    {
      code: `
        Vue.mixin({
          methods: {
            $foo () {}
          }
        })
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
      }
      </script>
      <script setup>
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default {
          name: 'InvalidComponent'
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default defineComponent({
        })
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default defineComponent({
          name: 'InvalidComponent'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default defineComponent({ })
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default defineComponent({
          name: 'InvalidComponent'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default { }
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default {
          name: 'InvalidComponent'
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
        nameNot: 'IssaNameNot'
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default {
        name: 'InvalidComponent',
        nameNot: 'IssaNameNot'
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default defineComponent({
          nameNot: 'IssaNameNot'
        })
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default defineComponent({
          name: 'InvalidComponent',
          nameNot: 'IssaNameNot'
        })
      `
            }
          ]
        }
      ]
    },

    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
          computed: {
            name() { return 'name' }
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default {
          name: 'InvalidComponent',
          computed: {
            name() { return 'name' }
          }
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
          [name]: 'IssaName'
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Required name property is not set.',
          type: 'ObjectExpression',
          suggestions: [
            {
              desc: 'Add name property to component.',
              output: `
        export default {
          name: 'InvalidComponent',
          [name]: 'IssaName'
        }
      `
            }
          ]
        }
      ]
    }
  ]
})
