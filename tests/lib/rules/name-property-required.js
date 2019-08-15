/**
 * @fileoverview Require a name property in Vue components
 * @author LukeeeeBennett
 */
'use strict'

const rule = require('../../../lib/rules/name-property-required')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('name-property-required', rule, {

  valid: [
    {
      filename: 'ValidComponent.vue',
      code: `
        export default {
          name: 'IssaName'
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
      errors: [{
        message: 'Required name property is undefined.',
        type: 'ObjectExpression'
      }]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
        nameNot: 'IssaNameNot'
        }
      `,
      parserOptions,
      errors: [{
        message: 'Required name property is undefined.',
        type: 'ObjectExpression'
      }]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
          name: ''
        }
      `,
      parserOptions,
      errors: [{
        message: 'Required name property is undefined.',
        type: 'ObjectExpression'
      }]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
          name: undefined
        }
      `,
      parserOptions,
      errors: [{
        message: 'Required name property is undefined.',
        type: 'ObjectExpression'
      }]
    },
    {
      filename: 'InvalidComponent.vue',
      code: `
        export default {
          name: null
        }
      `,
      parserOptions,
      errors: [{
        message: 'Required name property is undefined.',
        type: 'ObjectExpression'
      }]
    }
  ]
})
