/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const rule = require('../../../lib/rules/order-in-components')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}
const ruleTester = new RuleTester({ languageOptions })

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
      languageOptions
    },
    {
      filename: 'example.vue',
      code: `
        export default {
          el,
          name,
          parent,
          functional,
          delimiters, comments,
          components, directives, filters,
          extends: MyComp,
          mixins,
          provide, inject,
          inheritAttrs,
          model,
          props, propsData,
          emits,
          setup,
          data,
          computed,
          watch,
          beforeCreate,
          created,
          beforeMount,
          mounted,
          beforeUpdate,
          updated,
          activated,
          deactivated,
          beforeUnmount,
          unmounted,
          beforeDestroy,
          destroyed,
          renderTracked,
          renderTriggered,
          errorCaptured,
          methods,
          template, render,
          renderError,
        };
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {}
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default 'example-text'
      `,
      languageOptions
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
      languageOptions
    },
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
          computed: {
            ...mapStates(['foo'])
          },
        }
      `,
      languageOptions
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
      languageOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('example')
      `,
      languageOptions: { ecmaVersion: 6 }
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
      languageOptions: { ecmaVersion: 6 }
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
      languageOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        new Vue()
      `,
      languageOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'example.vue',
      code: `
      <script setup>
        defineOptions({
          name: 'Foo',
          inheritAttrs: true,
        })
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
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
      errors: [
        {
          message:
            'The "props" property should be above the "data" property on line 4.',
          line: 9
        }
      ],
      languageOptions
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
      errors: [
        {
          message:
            'The "name" property should be above the "render" property on line 3.',
          line: 8
        },
        {
          message:
            'The "data" property should be above the "render" property on line 3.',
          line: 9
        },
        {
          message:
            'The "props" property should be above the "data" property on line 9.',
          line: 14
        }
      ],
      languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: { jsx: true }
        }
      }
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
      errors: [
        {
          message:
            'The "components" property should be above the "data" property on line 4.',
          line: 9
        }
      ],
      languageOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.js',
      code: `
        app.component('smart-list', {
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
      output: `
        app.component('smart-list', {
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
      errors: [
        {
          message:
            'The "components" property should be above the "data" property on line 4.',
          line: 9
        }
      ],
      languageOptions: { ecmaVersion: 6 }
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
      errors: [
        {
          message:
            'The "components" property should be above the "data" property on line 5.',
          line: 10
        }
      ],
      languageOptions: { ecmaVersion: 6 }
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
      errors: [
        {
          message:
            'The "el" property should be above the "name" property on line 3.',
          line: 4
        },
        {
          message:
            'The "components" property should be above the "data" property on line 5.',
          line: 10
        }
      ],
      languageOptions: { ecmaVersion: 6 }
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
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 16
        }
      ],
      languageOptions
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
      output: `
        export default {
          data() {
          },
          test: 'ok',
          name: 'burger'
        };
      `,
      options: [{ order: ['data', 'test', 'name'] }],
      errors: [
        {
          message:
            'The "test" property should be above the "name" property on line 5.',
          line: 6
        }
      ],
      languageOptions
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
      output: `
        export default {
          /** name of vue component */
          name: 'burger',
          /** data provider */
          data() {
          }
        };
      `,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 4.',
          line: 7
        }
      ],
      languageOptions
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
      output: `
        export default {
          /** name of vue component */
          name: 'burger',
          /** data provider */
          data() {
          }/*test*/
        };
      `,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 4.',
          line: 7
        }
      ],
      languageOptions
    },
    {
      filename: 'example.vue',
      code: `export default {data(){},name:'burger'};`,
      output: `export default {name:'burger',data(){}};`,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 1.',
          line: 1
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: obj.fn(),
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: new MyClass(),
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: i++,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: i = 0,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: template\`\${foo}\`,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          [obj.fn()]: 'test',
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: {test: obj.fn()},
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: [obj.fn(), 1],
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: obj.fn().prop,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: delete obj.prop,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: fn() + a + b,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: a ? fn() : null,
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: null,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "name" property should be manually moved above the "data" property on line 3.',
              output: `
        export default {
          name: 'burger',
          data() {
          },
          test: \`test \${fn()} \${a}\`,
        };
      `
            }
          ]
        }
      ],
      languageOptions
    },
    {
      // side-effects https://github.com/vuejs/eslint-plugin-vue/issues/2418
      filename: 'example.vue',
      code: `
        export default {
          computed: {
            ...mapStates(['foo'])
          },
          data() {
          },
        };
      `,
      output: null,
      errors: [
        {
          message:
            'The "data" property should be above the "computed" property on line 3.',
          line: 6,
          suggestions: [
            {
              desc: 'There may be some side effects, the "data" property should be manually moved above the "computed" property on line 3.',
              output: `
        export default {
          data() {
          },
          computed: {
            ...mapStates(['foo'])
          },
        };
      `
            }
          ]
        }
      ],
      languageOptions
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
      output: `
        export default {
          name: 'burger',
          data() {
          },
          test: fn(),
        };
      `,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 5
        }
      ],
      languageOptions
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
          testNullish: a ?? b,
          testOptionalChaining: a?.b?.c,
          name: 'burger',
        };
      `,
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
          testNullish: a ?? b,
          testOptionalChaining: a?.b?.c,
        };
      `,
      errors: [
        {
          message:
            'The "name" property should be above the "data" property on line 3.',
          line: 15
        }
      ],
      languageOptions
    },
    {
      filename: 'example.vue',
      code: `
        <script lang="ts">
          export default {
            setup () {},
            props: {
              foo: { type: Array as PropType<number[]> },
            },
          };
        </script>
      `,
      output: `
        <script lang="ts">
          export default {
            props: {
              foo: { type: Array as PropType<number[]> },
            },
            setup () {},
          };
        </script>
      `,
      errors: [
        {
          message:
            'The "props" property should be above the "setup" property on line 4.',
          line: 5
        }
      ],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: {
          parser: { ts: require.resolve('@typescript-eslint/parser') }
        }
      }
    },
    {
      filename: 'example.vue',
      code: `
      <script setup>
        defineOptions({
          inheritAttrs: true,
          name: 'Foo',
        })
      </script>
      `,
      output: `
      <script setup>
        defineOptions({
          name: 'Foo',
          inheritAttrs: true,
        })
      </script>
      `,
      errors: [
        {
          message:
            'The "name" property should be above the "inheritAttrs" property on line 4.',
          line: 5
        }
      ],
      languageOptions: { parser: require('vue-eslint-parser') }
    }
  ]
})
