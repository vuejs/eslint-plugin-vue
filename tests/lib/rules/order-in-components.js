/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const rule = require('../../../lib/rules/order-in-components')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

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
          ...a,
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {}
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default 'example-text'
      `,
      parserOptions
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
      parserOptions
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
          el: '#app',
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
      parserOptions,
      output: `
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
      output: `
        export default {
          name: 'app',
          render (h) {
            return (
              <span>{ this.msg }</span>
            )
          },
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
      output: `
        Vue.component('smart-list', {
          name: 'app',
          components: {},
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          template: '<div></div>'
        })
      `,
      errors: [{
        message: 'The "components" property should be above the "data" property on line 4.',
        line: 9
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
      output: `
        const { component } = Vue;
        component('smart-list', {
          name: 'app',
          components: {},
          data () {
            return {
              msg: 'Welcome to Your Vue.js App'
            }
          },
          template: '<div></div>'
        })
      `,
      errors: [{
        message: 'The "components" property should be above the "data" property on line 5.',
        line: 10
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          name: 'app',
          el: '#app',
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
      output: `
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
      errors: [{
        message: 'The "el" property should be above the "name" property on line 3.',
        line: 4
      }, {
        message: 'The "components" property should be above the "data" property on line 5.',
        line: 10
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
      parserOptions,
      output: `
        export default {
          name: 'burger',
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
        };
      `,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 16
      }]
    },
    {
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          name: 'burger',
          test: 'ok'
        };
      `,
      parserOptions,
      output: `
        export default {
          data() {
          },
          test: 'ok',
          name: 'burger'
        };
      `,
      options: [{ order: ['data', 'test', 'name'] }],
      errors: [{
        message: 'The "test" property should be above the "name" property on line 5.',
        line: 6
      }]
    },
    {
      filename: 'example.vue',
      code: `
        export default {
          /** data provider */
          data() {
          },
          /** name of vue component */
          name: 'burger'
        };
      `,
      parserOptions,
      output: `
        export default {
          /** name of vue component */
          name: 'burger',
          /** data provider */
          data() {
          }
        };
      `,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 4.',
        line: 7
      }]
    },
    {
      filename: 'example.vue',
      code: `
        export default {
          /** data provider */
          data() {
          }/*test*/,
          /** name of vue component */
          name: 'burger'
        };
      `,
      parserOptions,
      output: `
        export default {
          /** name of vue component */
          name: 'burger',
          /** data provider */
          data() {
          }/*test*/
        };
      `,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 4.',
        line: 7
      }]
    },
    {
      filename: 'example.vue',
      code: `export default {data(){},name:'burger'};`,
      parserOptions,
      output: `export default {name:'burger',data(){}};`,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 1.',
        line: 1
      }]
    },
    {
      // side-effects CallExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: obj.fn(),
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects NewExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: new MyClass(),
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects UpdateExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: i++,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects AssignmentExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: i = 0,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects TaggedTemplateExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: template\`\${foo}\`,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects key
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          [obj.fn()]: 'test',
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects object deep props
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: {test: obj.fn()},
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects array elements
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: [obj.fn(), 1],
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects call at middle
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: obj.fn().prop,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects delete
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: delete obj.prop,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects within BinaryExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: fn() + a + b,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects within ConditionalExpression
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: a ? fn() : null,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // side-effects within TemplateLiteral
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          test: \`test \${fn()} \${a}\`,
          name: 'burger',
        };
      `,
      parserOptions,
      output: null,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 6
      }]
    },
    {
      // without side-effects
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          name: 'burger',
          test: fn(),
        };
      `,
      parserOptions,
      output: `
        export default {
          name: 'burger',
          data() {
          },
          test: fn(),
        };
      `,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 5
      }]
    },
    {
      // don't side-effects
      filename: 'example.vue',
      code: `
        export default {
          data() {
          },
          testArray: [1, 2, 3, true, false, 'a', 'b', 'c'],
          testRegExp: /[a-z]*/,
          testSpreadElement: [...array],
          testOperator: (!!(a - b + c * d / e % f)) || (a && b),
          testArrow: (a) => a,
          testConditional: a ? b : c,
          testYield: function* () {},
          testTemplate: \`a:\${a},b:\${b},c:\${c}.\`,
          name: 'burger',
        };
      `,
      parserOptions,
      output: `
        export default {
          name: 'burger',
          data() {
          },
          testArray: [1, 2, 3, true, false, 'a', 'b', 'c'],
          testRegExp: /[a-z]*/,
          testSpreadElement: [...array],
          testOperator: (!!(a - b + c * d / e % f)) || (a && b),
          testArrow: (a) => a,
          testConditional: a ? b : c,
          testYield: function* () {},
          testTemplate: \`a:\${a},b:\${b},c:\${c}.\`,
        };
      `,
      errors: [{
        message: 'The "name" property should be above the "data" property on line 3.',
        line: 13
      }]
    }
  ]
})
