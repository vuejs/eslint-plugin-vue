/**
 * @fileoverview Require component name property to match its file name
 * @author Rodrigo Pedra Brum <rodrigo.pedra@gmail.com>
 */
'use strict'

const rule = require('../../../lib/rules/match-component-file-name')
const RuleTester = require('../../eslint-compat').RuleTester

const jsxLanguageOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  parserOptions: {
    ecmaFeatures: { jsx: true }
  }
}

const languageOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()

ruleTester.run('match-component-file-name', rule, {
  valid: [
    // .jsx
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          render() { return <div /> }
        }
      `,
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: myComponent,
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name,
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: \`MyComponent\`,
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: \`My\${foo}\`,
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['vue'] }], // missing jsx in options
      languageOptions: jsxLanguageOptions
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
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
      options: [{ extensions: ['jsx'] }], // missing jsx in options
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
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
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <template>
          <div />
        </template>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
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
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: myComponent,
            template: '<div />'
          }
        </script>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name,
            template: '<div />'
          }
        </script>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: \`MyComponent\`,
            template: '<div />'
          }
        </script>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: \`My\${foo}\`,
            template: '<div />'
          }
        </script>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
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
      languageOptions // options default to [['jsx']]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({})
      `,
      languageOptions // options default to [['jsx']]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MComponent', {
          template: '<div />'
        })
      `,
      languageOptions // options default to [['jsx']]
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: 'MComponent',
          template: '<div />'
        })
      `,
      options: [{ extensions: ['vue'] }], // missing 'js' in options
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({})
      `,
      options: [{ extensions: ['vue'] }], // missing 'js' in options
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['vue'] }], // missing 'js' in options
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: 'MyComponent',
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: myComponent,
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name,
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: \`MyComponent\`,
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: \`My\${foo}\`,
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({})
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: 'MyComponent',
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: myComponent,
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: \`MyComponent\`,
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: \`My\${foo}\`,
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MyComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        app.component('MyComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(myComponent, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(\`MyComponent\`, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(\`My\${foo}\`, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },
    {
      filename: 'index.js',
      code: `
        Vue.component('MyComponent', {
          template: '<div />'
        })

        Vue.component('OtherComponent', {
          template: '<div />'
        })

        new Vue('OtherComponent', {
          name: 'ThirdComponent',
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions
    },

    // casing
    {
      filename: 'my-component.jsx',
      code: `
        export default {
          name: 'my-component',
          render() { return <div /> }
        }
      `,
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'my-component.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'my-component',
          render() { return <div /> }
        }
      `,
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'my-component.jsx',
      code: `
        export default {
          name: 'my-component',
          render() { return <div /> }
        }
      `,
      options: [{ shouldMatchCase: true }],
      languageOptions: jsxLanguageOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      options: [{ shouldMatchCase: true }],
      languageOptions: jsxLanguageOptions
    },
    // https://github.com/vuejs/eslint-plugin-vue/issues/1018
    {
      filename: 'test.jsx',
      code: `fn1(component.data)`,
      languageOptions
    },
    {
      filename: 'MyComponent.vue',
      code: `<script setup> defineOptions({name: 'MyComponent'}) </script>`,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
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
      languageOptions: jsxLanguageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MComponent',
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: "MComponent",
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        export default {
          name: "MyComponent",
          render() { return <div /> }
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: \`MComponent\`,
          render() { return <div /> }
        }
      `,
      options: [{ extensions: ['jsx'] }],
      languageOptions: jsxLanguageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        export default {
          name: \`MyComponent\`,
          render() { return <div /> }
        }
      `
            }
          ]
        }
      ]
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
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        <script>
          export default {
            name: 'MyComponent',
            template: '<div />'
          }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: "MComponent",
            template: '<div />'
          }
        </script>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        <script>
          export default {
            name: "MyComponent",
            template: '<div />'
          }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <script>
          export default {
            name: \`MComponent\`,
            template: '<div />'
          }
        </script>
      `,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        <script>
          export default {
            name: \`MyComponent\`,
            template: '<div />'
          }
        </script>
      `
            }
          ]
        }
      ]
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
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        new Vue({
          name: 'MyComponent',
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: "MComponent",
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        new Vue({
          name: "MyComponent",
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          name: \`MComponent\`,
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        new Vue({
          name: \`MyComponent\`,
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({
          name: 'MComponent',
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        Vue.mixin({
          name: 'MyComponent',
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({
          name: "MComponent",
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        Vue.mixin({
          name: "MyComponent",
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({
          name: \`MComponent\`,
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        Vue.mixin({
          name: \`MyComponent\`,
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        Vue.component('MyComponent', {
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component("MComponent", {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        Vue.component("MyComponent", {
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(\`MComponent\`, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        Vue.component(\`MyComponent\`, {
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.js',
      code: `
        app.component(\`MComponent\`, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      languageOptions,
      errors: [
        {
          message:
            'Component name `MComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        app.component(\`MyComponent\`, {
          template: '<div />'
        })
      `
            }
          ]
        }
      ]
    },

    // casing
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'my-component',
          render() { return <div /> }
        }
      `,
      options: [{ shouldMatchCase: true }],
      languageOptions: jsxLanguageOptions,
      errors: [
        {
          message:
            'Component name `my-component` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'my-component.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      options: [{ shouldMatchCase: true }],
      languageOptions: jsxLanguageOptions,
      errors: [
        {
          message:
            'Component name `MyComponent` should match file name `my-component`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `
        export default {
          name: 'my-component',
          render() { return <div /> }
        }
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'MyComponent.vue',
      code: `<script setup> defineOptions({name: 'CoolComponent'}) </script>`,
      options: [{ extensions: ['vue'] }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message:
            'Component name `CoolComponent` should match file name `MyComponent`.',
          suggestions: [
            {
              desc: 'Rename component to match file name.',
              output: `<script setup> defineOptions({name: 'MyComponent'}) </script>`
            }
          ]
        }
      ]
    }
  ]
})
