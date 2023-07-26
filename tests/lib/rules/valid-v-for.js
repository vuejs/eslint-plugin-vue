/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-for')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-for', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x of list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(x, i, k) in list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(x, i, k) of list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="({id, name}, i, k) of list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="([id, name], i, k) of list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><your-component v-for="x in list" :key="x.id"></your-component></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div is="your-component" v-for="x in list" :key="x.id"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div :is="your-component" v-for="x in list" :key="x.id"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><custom-component :key="x"></custom-component></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><div :key="x"></div></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list"><div></div></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="x of list"><slot name="item" /></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="x of list">foo<div></div></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x of list"><div v-for="foo of x" :key="foo"></div></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <template v-for="x in xs">
            <template v-for="y in x.ys">
              <li v-for="z in y.zs" :key="z.id">
                123
              </li>
            </template>
          </template>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <template v-for="x in xs">
            <template v-for="y in ys">
              <li v-for="z in zs" :key="x.id + y.id + z.id">
                123
              </li>
            </template>
          </template>
        </template>
      `
    },
    // key on <template> : In Vue.js 3.x, you can place key on <template>.
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" v-bind:key="x"><div /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" v-bind:key="x"><MyComp /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x"><div /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x"><MyComp /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x.id"><div /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x.id"><MyComp /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="(x, i) in list" :key="i"><div /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="(x, i) in list" :key="i"><MyComp /></template></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x in list" :key="x"><custom-component></custom-component></template></div></template>'
    },
    // key on <slot> : In Vue.js 3.x, you can place key on <slot>.
    {
      filename: 'test.vue',
      code: '<template><div><slot v-for="x in list" :key="x"><div /></slot></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot v-for="x in list" :key="x"><MyComp /></slot></div></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-for="."></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="xin list"><div></div></template></div></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><div v-for="/**/"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-for:aaa="x in list"></div></div></template>',
      errors: ["'v-for' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for.aaa="x in list"></div></div></template>',
      errors: ["'v-for' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for></div></div></template>',
      errors: ["'v-for' directives require that attribute value."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(,a,b) in list"></div></div></template>',
      errors: ["Invalid alias ''."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(a,,b) in list"></div></div></template>',
      errors: ["Invalid alias ''."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(a,b,,) in list"></div></div></template>',
      errors: ["Invalid alias ''."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(a,{b,c}) in list"></div></div></template>',
      errors: ["Invalid alias '{b,c}'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(a,b,{c,d}) in list"></div></div></template>',
      errors: ["Invalid alias '{c,d}'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><your-component v-for="x in list"></your-component></div></template>',
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div is="your-component" v-for="x in list"></div></div></template>',
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div :is="your-component" v-for="x in list"></div></div></template>',
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-bind:is="your-component" v-for="x in list"></div></div></template>',
      errors: ["Custom elements in iteration require 'v-bind:key' directives."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" :key="100"></div></div></template>',
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom-component v-for="x in list" :key="100"></custom-component></div></template>',
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" :key="foo"></div></div></template>',
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom-component v-for="x in list" :key="foo"></custom-component></div></template>',
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(item, index) in suggestions" :key></div></div></template>',
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><template v-for="x of list"><div v-for="foo of y" :key="foo"></div></template></div></template>',
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <template v-for="x in xs">
            <template v-for="y in a.ys">
              <li v-for="z in y.zs" :key="z.id">
                123
              </li>
            </template>
          </template>
        </template>
      `,
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <template v-for="x in xs">
            <template v-for="y in x.ys">
              <li v-for="z in a.zs" :key="z.id">
                123
              </li>
            </template>
          </template>
        </template>
      `,
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <template v-for="x in xs">
            <template v-for="y in x.ys">
              <li v-for="z in x.zs" :key="z.id">
                123
              </li>
            </template>
          </template>
        </template>
      `,
      errors: [
        "Expected 'v-bind:key' directive to use the variables which are defined by the 'v-for' directive."
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-for=""></div></template>',
      errors: ["'v-for' directives require that attribute value."]
    }
  ]
})
