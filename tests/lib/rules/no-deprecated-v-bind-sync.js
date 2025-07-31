/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview Disallow use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-v-bind-sync')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent :foo.sync='bar'/></template>",
      output: "<template><MyComponent v-model:foo='bar'/></template>",
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent v-bind:[dynamicArg].sync='bar'/></template>",
      output: "<template><MyComponent v-model:[dynamicArg]='bar'/></template>",
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent :[dynamicArg].sync='bar'/></template>",
      output: "<template><MyComponent v-model:[dynamicArg]='bar'/></template>",
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><MyComponent v-bind.sync='bar'/></template>",
      output: null,
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync.unknown="foo" /></template>',
      output: null,
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :[dynamicArg].sync.unknown="foo" /></template>',
      output: null,
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="x.foo" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="x.foo" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 69
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 70
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x - 1]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x - 1]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 74
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[`${x}`]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[`${x}`]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 75
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[`prefix_${x}`]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[`prefix_${x}`]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 82
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x ? x : \'_\']" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x ? x : \'_\']" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 80
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x || \'_\']" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x || \'_\']" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 77
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x()]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[x()]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 72
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[/r/.match(x) ? 0 : 1]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[/r/.match(x) ? 0 : 1]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 89
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[typeof x]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[typeof x]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 77
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[tag`${x}`]" /></div></div></template>',
      output:
        '<template><div><div v-for="x in list"><MyComponent v-model:foo="foo[tag`${x}`]" /></div></div></template>',
      errors: [
        {
          message:
            "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead.",
          line: 1,
          column: 52,
          endLine: 1,
          endColumn: 78
        }
      ]
    }
  ]
})
