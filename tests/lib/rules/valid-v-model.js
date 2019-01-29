/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-model')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-model', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input type="text" v-model.lazy="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input type="number" v-model.number="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input type="password" v-model.trim="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input type="checkbox" v-model="foo.bar"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input type="radio" v-model="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><textarea v-model="foo"></textarea></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><select v-model="foo"></select></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><your-component v-model="foo"></your-component></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="x.foo"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[x]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[x - 1]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[`${x}`]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[`prefix_${x}`]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[x ? x : \'_\']"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[x || \'_\']"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[x()]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[/r/.match(x) ? 0 : 1]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[typeof x]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="foo[tag`${x}`]"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input :type="a" v-model="b"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input v-bind:type="a" v-model="b"></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-model="foo"></div></template>',
      errors: ["'v-model' directives aren't supported on <div> elements."]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model:aaa="foo"></template>',
      errors: ["'v-model' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model.aaa="foo"></template>',
      errors: ["'v-model' directives don't support the modifier 'aaa'."]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model></template>',
      errors: ["'v-model' directives require that attribute value."]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="a + b"></template>',
      errors: ["'v-model' directives require the attribute value which is valid as LHS."]
    },
    {
      filename: 'test.vue',
      code: '<template><input type="file" v-model="b"></template>',
      errors: ["'v-model' directives don't support 'file' input type."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="x"></div></div></template>',
      errors: ["'v-model' directives cannot update the iteration variable 'x' itself."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="(x)"></div></div></template>',
      errors: ["'v-model' directives cannot update the iteration variable 'x' itself."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="(((x)))"></div></div></template>',
      errors: ["'v-model' directives cannot update the iteration variable 'x' itself."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="e in list"><input v-model="e"></div></div></template>',
      errors: ["'v-model' directives cannot update the iteration variable 'e' itself."]
    }
  ]
})
