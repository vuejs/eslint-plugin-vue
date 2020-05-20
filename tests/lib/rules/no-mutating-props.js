/**
 * @fileoverview disallow mutation of component props
 * @author 2018 Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-mutating-props')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

ruleTester.run('no-mutating-props', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-if="foo"></div>
            <div v-if="prop1 = [1, 2]"></div>
            <div v-if="prop2++"></div>
            <div v-text="prop3.shift()"></div>
            <div v-text="prop4.slice(0).shift()"></div>
            <div v-if="this.prop5 = [1, 2] && this.someProp"></div>
            <div v-if="this.prop6++ && this.someProp < 10"></div>
            <div v-text="this.prop7.shift()"></div>
            <div v-text="this.prop8.slice(0).shift()"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['foo']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="prop2">
            <input v-model="this.prop3.text">
            <input v-model="this.prop4">
            <input :value="prop5.text" @input="$emit('input', $event.target.value)">
            <div v-for="prop5 of data">
              <input v-model="prop5">
            </div>
            <div v-for="(prop6, index) of data">
              <input v-model="prop6">
            </div>
            <template v-for="(test, index) of data">
              <template v-for="(prop6, index) of data">
                <input v-model="prop6">
                <div v-text="prop6.shift()"></div>
              </template>
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop5', 'prop6', 'prop7', 'prop8']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="prop2">
            <input v-model="this.prop3.text">
            <input v-model="this.prop4">
          </div>
        </template>
        <script>
          export default {
            props: ['prop5', 'prop6', 'prop7', 'prop8']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-for="i in prop.slice()">
            <input v-for="i in prop.foo.slice()">
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              todo: {
                type: Object,
                required: true
              },
              items: {
                type: Array,
                default: []
              }
            },
            methods: {
              openModal() {
                this.$emit('someEvent', this.todo)
                const a = this.items.slice(0).push('something') // no mutation because of \`slice(0)\`
              }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="prop">
            <div v-for="prop in data">
              <MyComp @click="prop.foo++"></MyComp>
              <input v-model="prop">
            </div>
            <input v-model="prop()">
            <input v-model="foo">
            <input @click="prop().foo++">
          </div>
        </template>
        <script>
          export default {
            props: ['prop'],
            methods: {
              onKeydown() {
                const vm = this
                foo.prop = 1
                vm()()()
                vm.prop()()
                prop++
                prop = 1
              }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <button @click="foo++"></button>
            <button @click="foo+=1"></button>
            <button @click="foo.push($event)"></button>
            <input v-model="foo">
          </div>
        </template>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-if="prop1 = [1, 2]"></div>
            <div v-if="prop2++"></div>
            <div v-text="prop3.shift()"></div>
            <div v-text="prop4.slice(0).shift()"></div>
            <div v-if="this.prop5 = [1, 2] && this.someProp"></div>
            <div v-if="this.prop6++ && this.someProp < 10"></div>
            <div v-text="this.prop7.shift()"></div>
            <div v-text="this.prop8.slice(0).shift()"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4
        },
        {
          message: 'Unexpected mutation of "prop2" prop.',
          line: 5
        },
        {
          message: 'Unexpected mutation of "prop3" prop.',
          line: 6
        },
        {
          message: 'Unexpected mutation of "prop5" prop.',
          line: 8
        },
        {
          message: 'Unexpected mutation of "prop6" prop.',
          line: 9
        },
        {
          message: 'Unexpected mutation of "prop7" prop.',
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="prop2">
            <input v-model="this.prop3.text">
            <input v-model="this.prop4">
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3', 'prop4']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4
        },
        {
          message: 'Unexpected mutation of "prop2" prop.',
          line: 5
        },
        {
          message: 'Unexpected mutation of "prop3" prop.',
          line: 6
        },
        {
          message: 'Unexpected mutation of "prop4" prop.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              todo: {
                type: Object,
                required: true
              },
              items: {
                type: Array,
                default: []
              }
            },
            methods: {
              openModal() {
                ++this.items
                this.todo.type = 'completed'
                this.items.push('something')
              }
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "items" prop.',
          line: 16
        },
        {
          message: 'Unexpected mutation of "todo" prop.',
          line: 17
        },
        {
          message: 'Unexpected mutation of "items" prop.',
          line: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <template v-for="(test, index) of data">
              <template v-for="(prop, index) of data">
                <input v-model="prop">
              </template>
              <input v-model="prop">
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <template v-for="prop of data">
              <input v-model="this.prop">
              <div v-text="prop.shift()"></div>
              <div v-text="this.prop.shift()"></div>
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 5
        },
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 7
        }
      ]
    }
  ]
})
