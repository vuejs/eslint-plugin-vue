/**
 * @fileoverview Enforce or forbid passing `true` value to a prop
 * @author Anton Veselev
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-shorthand-boolean-prop')

const { RuleTester } = require('eslint')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('require-shorthand-boolean-prop', rule, {

  valid: [
    {
      code: `
        <template>
          <component />
        </template>
      `
    },
    {
      code: `
        <template>
          <component
            isValid
          />
        </template>
      `
    },
    {
      code: `
        <template>
          <component
            isValid
          />
        </template>
      `,
      options: ['always']
    },
    {
      code: `
        <template>
          <component
            :isValid="false"
          />
        </template>
      `,
      options: ['always']
    },
    {
      code: `
        <template>
          <component
            :isValid="true"
          />
        </template>
      `,
      options: ['never']
    },
    {
      code: `
        <template>
          <component
            :isValid="false"
          />
        </template>
      `,
      options: ['never']
    },
    {
      code: `
        <template>
          <component
            str="true"
          />
        </template>
      `
    },
    {
      code: `
        <template>
          <component
            str="true"
          />
        </template>
      `,
      options: ['always']
    },
    {
      code: `
        <template>
          <component
            str="true"
          />
        </template>
      `,
      options: ['never']
    }
  ],

  invalid: [
    {
      code: `
        <template>
          <component
            :isValid="true"
          />
        </template>
      `,
      errors: [{
        message: "Unexpected 'true' value.",
        type: 'VStartTag'
      }]
    },
    {
      code: `
        <template>
          <component
            isValid
          />
        </template>
      `,
      options: ['never'],
      errors: [{
        message: 'Unexpected shorthand prop.',
        type: 'VStartTag'
      }]
    },
    {
      code: `
        <template>
          <component
            :isValid="true"
          />
        </template>
      `,
      options: ['always'],
      errors: [{
        message: "Unexpected 'true' value.",
        type: 'VStartTag'
      }]
    }
  ]
})
