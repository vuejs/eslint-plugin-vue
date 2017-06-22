/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const rule = require('../../../lib/rules/order-in-components')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

ruleTester.run('order-in-components', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'app',
          props: {
            propA: Number,
          },
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {}
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default 'example-text'
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.jsx',
      code: `
        export default {
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('smart-list', {
          name: 'app',
          components: {},
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('example')
      `,
      parserOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        const { component } = Vue;
        component('smart-list', {
          name: 'app',
          components: {},
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          name: 'app',
          components: {},
          el: '#app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        new Vue()
      `,
      parserOptions: { ecmaVersion: 6 }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          props: {
            propA: Number,
          },
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "props" property should be above the "data" property on line 4.',
        line: 9
      }]
    },
    {
      filename: 'test.jsx',
      code: `
        export default {
          render (h) {
            return (
              <span>{ this.msg }</span>
            )
          },
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          props: {
            propA: Number,
          },
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module', ecmaFeatures: { jsx: true }},
      errors: [{
        message: 'The "name" property should be above the "render" property on line 3.',
        line: 8
      }, {
        message: 'The "data" property should be above the "render" property on line 3.',
        line: 9
      }, {
        message: 'The "props" property should be above the "data" property on line 9.',
        line: 14
      }]
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('smart-list', {
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          components: {},
          template: '<div></div>'
        })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'The "components" property should be above the "data" property on line 4.',
        line: 9
      }, {
        message: 'The "template" property should be above the "data" property on line 4.',
        line: 10
      }]
    },
    {
      filename: 'test.js',
      code: `
        const { component } = Vue;
        component('smart-list', {
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          components: {},
          template: '<div></div>'
        })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'The "components" property should be above the "data" property on line 5.',
        line: 10
      }, {
        message: 'The "template" property should be above the "data" property on line 5.',
        line: 11
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          el: '#app',
          name: 'app',
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          components: {},
          template: '<div></div>'
        })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'The "name" property should be above the "el" property on line 3.',
        line: 4
      }, {
        message: 'The "components" property should be above the "el" property on line 3.',
        line: 10
      }, {
        message: 'The "template" property should be above the "data" property on line 5.',
        line: 11
      }]
    },
    {
      filename: 'example.vue',
      code: `
        export default {
          data() {
            return {
              isActive: false,
            };
          },
          methods: {
            toggleMenu() {
              this.isActive = !this.isActive;
            },
            closeMenu() {
              this.isActive = false;
            }
          },
          name: 'burger',
        };
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 16
      }]
    }
  ]
})
