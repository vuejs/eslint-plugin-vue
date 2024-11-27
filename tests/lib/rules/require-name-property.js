/**
 * @fileoverview Require a name property in Vue components
 * @author LukeeeeBennett
 */
'use strict'

const rule = require('../../../lib/rules/require-name-property')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
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
      languageOptions
    },
    {
      filename: 'ValidComponent.vue',
      code: `
        export default {
          name: undefined
        }
      `,
      languageOptions
    },
    {
      filename: 'ValidComponent.vue',
      code: `
        export default {
          name: ''
        }
      `,
      languageOptions
    },
    {
      code: `
        Vue.mixin({
          methods: {
            $foo () {}
          }
        })
      `,
      languageOptions
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    }
  ],

  invalid: [
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
        }
      `,
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
