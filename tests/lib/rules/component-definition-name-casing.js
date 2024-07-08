/**
 * @fileoverview enforce specific casing for component definition name
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/component-definition-name-casing')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
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
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...name
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'FooBar'
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'FooBar'
        }
      `,
      options: ['PascalCase'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'foo-bar'
        }
      `,
      options: ['kebab-case'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', {})`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', {})`,
      options: ['PascalCase'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo-bar', {})`,
      options: ['kebab-case'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(fooBar, {})`,
      options: ['kebab-case'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', component)`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', component)`,
      options: ['PascalCase'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('foo-bar', component)`,
      options: ['kebab-case'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(fooBar, component)`,
      options: ['kebab-case'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `app.component('FooBar', component)`,
      options: ['PascalCase'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.mixin({})`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `foo({})`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `foo('foo-bar', {})`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(\`fooBar\${foo}\`, component)`,
      options: ['kebab-case'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `app.component(\`fooBar\${foo}\`, component)`,
      options: ['kebab-case'],
      languageOptions
    },
    // https://github.com/vuejs/eslint-plugin-vue/issues/1018
    {
      filename: 'test.js',
      code: `fn1(component.data)`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({}) </script>`,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({name: 'FooBar'}) </script>`,
      options: ['PascalCase'],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `<script setup> defineOptions({name: 'foo-bar'}) </script>`,
      options: ['kebab-case'],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions: { ecmaVersion: 6 },
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ...languageOptions
      },
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message: 'Property name "FooBar" is not kebab-case.',
          line: 1
        }
      ]
    }
  ]
})
