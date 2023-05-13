/**
 * @fileoverview Require component name property to match its file name
 * @author Rodrigo Pedra Brum <rodrigo.pedra@gmail.com>
 */
'use strict'

const rule = require('../../../lib/rules/match-component-file-name')
const RuleTester = require('eslint').RuleTester

const jsxParserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: { jsx: true }
}

const parserOptions = {
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
      parserOptions: jsxParserOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parser: require.resolve('vue-eslint-parser'),
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
      options: [{ extensions: ['jsx'] }], // missing jsx in options
      parser: require.resolve('vue-eslint-parser'),
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
      options: [{ extensions: ['vue'] }],
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
    },
    {
      filename: 'MyComponent.vue',
      code: `
        <template>
          <div />
        </template>
      `,
      options: [{ extensions: ['vue'] }],
      parser: require.resolve('vue-eslint-parser'),
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
      options: [{ extensions: ['vue'] }],
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
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
      parser: require.resolve('vue-eslint-parser'),
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
        Vue.mixin({})
      `,
      parserOptions // options default to [['jsx']]
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MComponent', {
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
      options: [{ extensions: ['vue'] }], // missing 'js' in options
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({})
      `,
      options: [{ extensions: ['vue'] }], // missing 'js' in options
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['vue'] }], // missing 'js' in options
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue({
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
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
      options: [{ extensions: ['js'] }],
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.mixin({})
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: 'MyComponent',
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: myComponent,
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: \`MyComponent\`,
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        new Vue.mixin({
          name: \`My\${foo}\`,
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component('MyComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        app.component('MyComponent', {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(myComponent, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(\`MyComponent\`, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
    },
    {
      filename: 'MyComponent.js',
      code: `
        Vue.component(\`My\${foo}\`, {
          template: '<div />'
        })
      `,
      options: [{ extensions: ['js'] }],
      parserOptions
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
      parserOptions
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
      parserOptions: jsxParserOptions
    },
    {
      filename: 'my-component.jsx',
      code: `
        export default {
          name: 'MyComponent',
          render() { return <div /> }
        }
      `,
      parserOptions: jsxParserOptions
    },
    {
      filename: 'MyComponent.jsx',
      code: `
        export default {
          name: 'my-component',
          render() { return <div /> }
        }
      `,
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
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
      parserOptions: jsxParserOptions
    },
    // https://github.com/vuejs/eslint-plugin-vue/issues/1018
    {
      filename: 'test.jsx',
      code: `fn1(component.data)`,
      parserOptions
    },
    {
      filename: 'MyComponent.vue',
      code: `<script setup> defineOptions({name: 'MyComponent'}) </script>`,
      options: [{ extensions: ['vue'] }],
      parser: require.resolve('vue-eslint-parser'),
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
      parserOptions: jsxParserOptions,
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
      parserOptions: jsxParserOptions,
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
      parserOptions: jsxParserOptions,
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
      parserOptions: jsxParserOptions,
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions,
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions,
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions: jsxParserOptions,
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
      parserOptions: jsxParserOptions,
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
      parser: require.resolve('vue-eslint-parser'),
      parserOptions,
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
