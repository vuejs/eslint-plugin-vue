/**
 * @fileoverview Enforce the location of first attribute
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/first-attribute-linebreak')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('first-attribute-linebreak', rule, {
  valid: [
    {
      code: `
      <template>
        <component></component>
      </template>`
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'ignore', multiline: 'ignore' }]
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'beside', multiline: 'ignore' }]
    },
    {
      code: `
      <template>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'ignore', multiline: 'beside' }]
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'below', multiline: 'ignore' }]
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'ignore', multiline: 'below' }]
    }
  ],

  invalid: [
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      output: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component
name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      errors: [
        {
          message: 'Expected a linebreak before this attribute.',
          line: 8,
          column: 20
        }
      ]
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      output: `
      <template>
        <component name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'beside', multiline: 'beside' }],
      errors: [
        {
          message: 'Expected no linebreak before this attribute.',
          line: 4,
          column: 11
        },
        {
          message: 'Expected no linebreak before this attribute.',
          line: 13,
          column: 11
        }
      ]
    },
    {
      code: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component name="John Doe"
        ></component>
      </template>`,
      output: `
      <template>
        <component
          name="John Doe"
          age="30"
          job="Vet"
        ></component>
        <component
name="John Doe"
                   age="30"
                   job="Vet"
        ></component>
        <component
          name="John Doe"
        ></component>
        <component
name="John Doe"
        ></component>
      </template>`,
      options: [{ singleline: 'below', multiline: 'below' }],
      errors: [
        {
          message: 'Expected a linebreak before this attribute.',
          line: 8,
          column: 20
        },
        {
          message: 'Expected a linebreak before this attribute.',
          line: 15,
          column: 20
        }
      ]
    }
  ]
})
