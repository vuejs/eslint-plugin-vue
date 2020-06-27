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
          type: 'ObjectExpression'
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
          type: 'ObjectExpression'
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
          type: 'ObjectExpression'
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
          type: 'ObjectExpression'
        }
      ]
    }
  ]
})
