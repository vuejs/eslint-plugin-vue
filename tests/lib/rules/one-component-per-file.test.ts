/**
 * @fileoverview enforce that each component should be in its own file
 * @author Armano
 */
import rule from '../../../lib/rules/one-component-per-file'
import { RuleTester } from '../../eslint-compat'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

ruleTester.run('one-component-per-file', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `Vue.component('name', {})`
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('name', {})
        new Vue({})
      `
    },
    {
      filename: 'test.js',
      code: `
        const foo = {}
        new Vue({})
      `
    },
    {
      filename: 'test.vue',
      code: `export default {}`
    },
    {
      filename: 'test.vue',
      code: `export default {
        components: {
          test: {
            name: 'foo'
          }
        }
      }`
    },
    {
      filename: 'test.js',
      code: `
        Vue.mixin({})
        Vue.component('name', {})
      `
    },
    {
      filename: 'test.js',
      code: `
        import { createApp } from 'vue'
        createApp({})
      `
    },
    {
      filename: 'test.js',
      code: `
        import { component } from 'other.js'
        component({})
        component({})
      `
    },
    {
      filename: 'test.js',
      code: `
        import { createApp } from 'other.js'
        createApp({})
        createApp({})
      `
    },
    {
      filename: 'test.js',
      code: `
        import { defineComponent } from 'other.js'
        defineComponent({})
        defineComponent({})
      `
    },
    {
      filename: 'test.js',
      code: `
        function createApp() {}
        createApp({})
        createApp({})
      `
    },
    {
      filename: 'test.js',
      code: `
        const { createApp } = require('other.js')
        createApp({})
        createApp({})
      `
    }
  ],
  invalid: [
    {
      filename: 'test.js',
      code: `
        Vue.component('name', {})
        Vue.component('name', {})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 31,
          endLine: 2,
          endColumn: 33
        },
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('TodoList', {
          // ...
        })

        Vue.component('TodoItem', {
          // ...
        })
        export default {}
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 35,
          endLine: 4,
          endColumn: 10
        },
        {
          message: 'There is more than one component in this file.',
          line: 6,
          column: 35,
          endLine: 8,
          endColumn: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        Vue.component('name', {})
        export default {}
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 31,
          endLine: 2,
          endColumn: 33
        },
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import { component } from 'vue'
        component('', {})
        component('', {})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 25
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        const { component } = Vue
        component('', {})
        component('', {})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 25
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import { component } from '@vue/composition-api'
        component('', {})
        component('', {})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 25
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import { createApp } from 'vue'
        createApp({})
        createApp({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import { createApp } from '@vue/composition-api'
        createApp({})
        createApp({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        const { createApp } = Vue
        createApp({})
        createApp({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        const createApp = Vue.createApp
        createApp({})
        createApp({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 21
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import { defineComponent } from 'vue'
        defineComponent({})
        defineComponent({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 27
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import { defineComponent } from '@vue/composition-api'
        defineComponent('', {})
        defineComponent('', {})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 31
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        defineComponent({})
        defineComponent({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 27
        },
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        const { defineComponent } = require('vue')
        defineComponent({})
        defineComponent({})
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 27
        },
        {
          message: 'There is more than one component in this file.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
        }
      ]
    }
  ]
})
