/**
 * @fileoverview enforce specific casing for component definition name
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/component-definition-name-casing')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('component-definition-name-casing', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...name
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'FooBar'
        }
      `,
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
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', {})`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', {})`,
      options: ['PascalCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo-bar', {})`,
      options: ['kebab-case'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(fooBar, {})`,
      options: ['kebab-case'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', component)`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', component)`,
      options: ['PascalCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo-bar', component)`,
      options: ['kebab-case'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(fooBar, component)`,
      options: ['kebab-case'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `app.component('FooBar', component)`,
      options: ['PascalCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.mixin({})`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `foo({})`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `foo('foo-bar', {})`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(\`fooBar\${foo}\`, component)`,
      options: ['kebab-case'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `app.component(\`fooBar\${foo}\`, component)`,
      options: ['kebab-case'],
      parserOptions
    },
    // https://github.com/vuejs/eslint-plugin-vue/issues/1018
    {
      filename: 'test.js',
      code: `fn1(component.data)`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({}) </script>`,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({name: 'FooBar'}) </script>`,
      options: ['PascalCase'],
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({name: 'foo-bar'}) </script>`,
      options: ['kebab-case'],
      parser: require.resolve('vue-eslint-parser'),
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
          name: 'FooBar'
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          type: 'Literal',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo  bar'
        }
      `,
      output: null,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo  bar" is not PascalCase.',
          type: 'Literal',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo!bar'
        }
      `,
      output: null,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo!bar" is not PascalCase.',
          type: 'Literal',
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          name: 'foo!bar'
        })
      `,
      output: null,
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: 'Property name "foo!bar" is not PascalCase.',
          type: 'Literal',
          line: 3
        }
      ]
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
          name: 'FooBar'
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo_bar" is not PascalCase.',
          type: 'Literal',
          line: 3
        }
      ]
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
          name: 'FooBar'
        }
      `,
      options: ['PascalCase'],
      parserOptions,
      errors: [
        {
          message: 'Property name "foo_bar" is not PascalCase.',
          type: 'Literal',
          line: 3
        }
      ]
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
      errors: [
        {
          message: 'Property name "foo_bar" is not kebab-case.',
          type: 'Literal',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo-bar', component)`,
      output: `Vue.component('FooBar', component)`,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `app.component('foo-bar', component)`,
      output: `app.component('FooBar', component)`,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `(Vue as VueConstructor<Vue>).component('foo-bar', component)`,
      output: `(Vue as VueConstructor<Vue>).component('FooBar', component)`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo-bar', {})`,
      output: `Vue.component('FooBar', {})`,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `app.component('foo-bar', {})`,
      output: `app.component('FooBar', {})`,
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.js',
      code: `Vue.component('foo_bar', {})`,
      output: `Vue.component('FooBar', {})`,
      options: ['PascalCase'],
      parserOptions,
      errors: [
        {
          message: 'Property name "foo_bar" is not PascalCase.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo_bar', {})`,
      output: `Vue.component('foo-bar', {})`,
      options: ['kebab-case'],
      parserOptions,
      errors: [
        {
          message: 'Property name "foo_bar" is not kebab-case.',
          type: 'Literal',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `Vue.component(\`foo_bar\`, {})`,
      output: `Vue.component(\`foo-bar\`, {})`,
      options: ['kebab-case'],
      parserOptions,
      errors: [
        {
          message: 'Property name "foo_bar" is not kebab-case.',
          type: 'TemplateLiteral',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({name: 'foo-bar'}) </script>`,
      output: `<script setup> defineOptions({name: 'FooBar'}) </script>`,
      options: ['PascalCase'],
      parser: require.resolve('vue-eslint-parser'),
      parserOptions,
      errors: [
        {
          message: 'Property name "foo-bar" is not PascalCase.',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({name: 'FooBar'}) </script>`,
      output: `<script setup> defineOptions({name: 'foo-bar'}) </script>`,
      options: ['kebab-case'],
      parser: require.resolve('vue-eslint-parser'),
      parserOptions,
      errors: [
        {
          message: 'Property name "FooBar" is not kebab-case.',
          line: 1
        }
      ]
    }
  ]
})
