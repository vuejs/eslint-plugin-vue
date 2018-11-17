/**
 * @fileoverview Require component name property to match its file name
 * @author Rodrigo Pedra Brum <rodrigo.pedra@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/match-component-file-name')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('match-component-file-name', rule, {
  valid: [
    // ,jsx
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          render() { return <div /> }
        }
      `,
      parserOptions: { ...parserOptions, ecmaFeatures: { jsx: true }}
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      parserOptions: { ...parserOptions, ecmaFeatures: { jsx: true }}
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      options: [['jsx']],
      parserOptions: { ...parserOptions, ecmaFeatures: { jsx: true }}
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      options: [['vue']], // missing jsx in options
      parserOptions: { ...parserOptions, ecmaFeatures: { jsx: true }}
    },

    // .vue
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
      parser: 'vue-eslint-parser',
      parserOptions // options default to [['jsx']]
    },
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
      options: [['jsx']], // missing 'vue' in options
      parser: 'vue-eslint-parser',
      parserOptions
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            template: '<div />'
          }
        </script>
      `,
      options: [['vue']],
      parser: 'vue-eslint-parser',
      parserOptions
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <template>
          <div />
        </template>
      `,
      options: [['vue']],
      parser: 'vue-eslint-parser',
      parserOptions
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
      options: [['vue']],
      parser: 'vue-eslint-parser',
      parserOptions
    },

    // .js
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: 'MComponent',
          template: '<div />'
        })
      `,
      parserOptions // options default to [['jsx']]
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: 'MComponent',
          template: '<div />'
        })
      `,
      options: [['vue']], // missing 'js' in options
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          template: '<div />'
        })
      `,
      options: [['js']],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: 'MyComponent',
          template: '<div />'
        })
      `,
      options: [['js']],
      parserOptions
    }
  ],

  invalid: [
    // .jsx
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      parserOptions: { ...parserOptions, ecmaFeatures: { jsx: true }},
      errors: [{
        message: 'Component name `MComponent` should match file name MyComponent.'
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
      options: [['jsx']],
      parserOptions: { ...parserOptions, ecmaFeatures: { jsx: true }},
      errors: [{
        message: 'Component name `MComponent` should match file name MyComponent.'
      }]
    },

    // .vue
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
      options: [['vue']],
      parser: 'vue-eslint-parser',
      parserOptions,
      errors: [{
        message: 'Component name `MComponent` should match file name MyComponent.'
      }]
    },

    // .js
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: 'MComponent',
          template: '<div />'
        })
      `,
      options: [['js']],
      parserOptions,
      errors: [{
        message: 'Component name `MComponent` should match file name MyComponent.'
      }]
    }
  ]
})
