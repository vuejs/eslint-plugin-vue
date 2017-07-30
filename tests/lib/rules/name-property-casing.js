/**
 * @fileoverview Define a style for the name property casing for consistency purposes
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/name-property-casing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('name-property-casing', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
        }
      `,
      options: ['camelCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'fooBar'
        }
      `,
      options: ['camelCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'FooBar'
        }
      `,
      options: ['PascalCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo-bar'
        }
      `,
      options: ['kebab-case'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo-bar'
        }
      `,
      options: ['camelCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Property name "foo-bar" is not camelCase.',
        type: 'Literal',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo  bar'
        }
      `,
      options: ['PascalCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Property name "foo  bar" is not PascalCase.',
        type: 'Literal',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo!bar'
        }
      `,
      options: ['camelCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Property name "foo!bar" is not camelCase.',
        type: 'Literal',
        line: 3
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          name: 'foo!bar'
        })
      `,
      options: ['camelCase'],
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'Property name "foo!bar" is not camelCase.',
        type: 'Literal',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo_bar'
        }
      `,
      options: ['camelCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Property name "foo_bar" is not camelCase.',
        type: 'Literal',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo_bar'
        }
      `,
      options: ['PascalCase'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Property name "foo_bar" is not PascalCase.',
        type: 'Literal',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo_bar'
        }
      `,
      options: ['kebab-case'],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Property name "foo_bar" is not kebab-case.',
        type: 'Literal',
        line: 3
      }]
    }
  ]
})
