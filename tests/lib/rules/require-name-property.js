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
      ],
      languageOptions
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default defineComponent({
        })
      `,
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
      ],
      languageOptions
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default defineComponent({ })
      `,
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
      ],
      languageOptions
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default { }
      `,
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
      ],
      languageOptions
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
        nameNot: 'IssaNameNot'
        }
      `,
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
      ],
      languageOptions
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default defineComponent({
          nameNot: 'IssaNameNot'
        })
      `,
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
      ],
      languageOptions
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
      ],
      languageOptions
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
          [name]: 'IssaName'
        }
      `,
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
      ],
      languageOptions
    }
  ]
})
