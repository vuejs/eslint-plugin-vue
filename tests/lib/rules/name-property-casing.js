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

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: { experimentalObjectRestSpread: true }
}

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
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...name
        }
      `,
      options: ['camelCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'fooBar'
        }
      `,
      options: ['camelCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'FooBar'
        }
      `,
      options: ['PascalCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo-bar'
        }
      `,
      options: ['kebab-case'],
      parserOptions
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
      output: `
        export default {
          name: 'fooBar'
        }
      `,
      options: ['camelCase'],
      parserOptions,
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
      output: `
        export default {
          name: 'FooBar'
        }
      `,
      parserOptions,
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
      output: `
        export default {
          name: 'fooBar'
        }
      `,
      options: ['camelCase'],
      parserOptions,
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
      output: `
        new Vue({
          name: 'fooBar'
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
      output: `
        export default {
          name: 'foobar'
        }
      `,
      options: ['camelCase'],
      parserOptions,
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
      output: `
        export default {
          name: 'Foobar'
        }
      `,
      options: ['PascalCase'],
      parserOptions,
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
      output: `
        export default {
          name: 'foo-bar'
        }
      `,
      options: ['kebab-case'],
      parserOptions,
      errors: [{
        message: 'Property name "foo_bar" is not kebab-case.',
        type: 'Literal',
        line: 3
      }]
    }
  ]
})
