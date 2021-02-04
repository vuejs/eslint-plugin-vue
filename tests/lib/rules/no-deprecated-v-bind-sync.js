/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview Disallow use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-v-bind-sync')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-v-bind-sync', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: "<template><MyComponent v-bind:foo='bar'/></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent :foo='bar'/></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent v-bind:[dynamicArg]='bar'/></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent :[dynamicArg]='bar'/></template>"
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: "<template><MyComponent v-bind:foo.sync='bar'/></template>",
      output: "<template><MyComponent v-model:foo='bar'/></template>",
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent :foo.sync='bar'/></template>",
      output: "<template><MyComponent v-model:foo='bar'/></template>",
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        "<template><MyComponent v-bind:[dynamicArg].sync='bar'/></template>",
      output: "<template><MyComponent v-model:[dynamicArg]='bar'/></template>",
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent :[dynamicArg].sync='bar'/></template>",
      output: "<template><MyComponent v-model:[dynamicArg]='bar'/></template>",
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent v-bind.sync='bar'/></template>",
      output: "<template><MyComponent v-bind.sync='bar'/></template>",
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync.unknown="foo" /></template>',
      output: '<template><MyComponent :foo.sync.unknown="foo" /></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><MyComponent :[dynamicArg].sync.unknown="foo" /></template>',
      output:
        '<template><MyComponent :[dynamicArg].sync.unknown="foo" /></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="x.foo" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="x.foo" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x - 1]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x - 1]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[`${x}`]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[`${x}`]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[`prefix_${x}`]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[`prefix_${x}`]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x ? x : \'_\']" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x ? x : \'_\']" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x || \'_\']" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x || \'_\']" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x()]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x()]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[/r/.match(x) ? 0 : 1]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[/r/.match(x) ? 0 : 1]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[typeof x]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[typeof x]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[tag`${x}`]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[tag`${x}`]" /></div></div></template>',
      errors: [
        "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
      ]
    }
  ]
})
