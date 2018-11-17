/**
 * @fileoverview Require component name property to match its file name
 * @author Rodrigo Pedra Brum <rodrigo.pedra@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/match-component-file-name')

const jsxRuleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

const vueRuleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

jsxRuleTester.run('match-component-file-name', rule, {
  valid: [
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      options: ['jsx']
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      options: ['both']
    }
  ],

  invalid: [
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      errors: [{
        message: 'Component name should match file name (MyComponent / MComponent).'
      }]
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      options: ['jsx'],
      errors: [{
        message: 'Component name should match file name (MyComponent / MComponent).'
      }]
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      options: ['both'],
      errors: [{
        message: 'Component name should match file name (MyComponent / MComponent).'
      }]
    }
  ]
})

vueRuleTester.run('match-component-file-name', rule, {
  valid: [
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: 'MComponent',
            template: '<div />'
          }
        </script>
      ` // missing ["both"] option, so the file is ignored
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: 'MyComponent',
            template: '<div />'
          }
        </script>
      `,
      options: ['both']
    }
  ],

  invalid: [
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: 'MComponent',
            template: '<div />'
          }
        </script>
      `,
      options: ['both'],
      errors: [{
        message: 'Component name should match file name (MyComponent / MComponent).'
      }]
    }
  ]
})
