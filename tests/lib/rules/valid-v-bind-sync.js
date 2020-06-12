/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-bind-sync')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('valid-v-bind-sync', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-bind:foo.sync="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="foo.bar" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-bind.sync="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><svg><MyComponent :foo.sync="foo" /></svg></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="this.foo().bar" /></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><svg><MyComponent :foo.sync="this.foo().bar" /></svg></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="x.foo" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x - 1]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[`${x}`]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[`prefix_${x}`]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x ? x : \'_\']" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x || \'_\']" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[x()]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[/r/.match(x) ? 0 : 1]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[typeof x]" /></div></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div><div v-for="x in list"><MyComponent :foo.sync="foo[tag`${x}`]" /></div></div></template>'
    },
    // not .sync
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo="a + b" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-bind:foo="a + b" /></template>'
    },
    // does not report
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-bind:foo.sync /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync.unknown="foo" /></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent :foo.sync="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent :foo.sync="/**/" /></template>'
    },
    // empty value (valid-v-bind)
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent :foo.sync="" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent :foo.sync="a + b" />
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers require the attribute value which is valid as LHS.",
          line: 3,
          column: 24,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent v-bind:foo.sync="a + b" />
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers require the attribute value which is valid as LHS.",
          line: 3,
          column: 24,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <input :foo.sync="foo">
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers aren't supported on <input> non Vue-components.",
          line: 3,
          column: 18,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent :foo.sync="foo()" />
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers require the attribute value which is valid as LHS.",
          line: 3,
          column: 24,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent :foo.sync="this.foo()" />
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers require the attribute value which is valid as LHS.",
          line: 3,
          column: 24,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <input v-bind:foo.sync="foo">
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers aren't supported on <input> non Vue-components.",
          line: 3,
          column: 18,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="x in list">
            <MyComponent :foo.sync="x" />
          </div>
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers cannot update the iteration variable 'x' itself.",
          line: 4,
          column: 26,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="e in list">
            <MyComponent v-bind:foo.sync="e" />
          </div>
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers cannot update the iteration variable 'e' itself.",
          line: 4,
          column: 26,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="e1 in list1">
            <div><div>
              <div v-for="e2 in list2">
                <MyComponent v-bind:foo.sync="e1" />
              </div>
            </div></div>
          </div>
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers cannot update the iteration variable 'e1' itself.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="(e, index) in list">
            <MyComponent v-bind:foo.sync="index" />
          </div>
        </template>
      `,
      errors: [
        {
          message:
            "'.sync' modifiers cannot update the iteration variable 'index' itself.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div :foo.sync="foo"></div>
        </template>
      `,
      errors: [
        "'.sync' modifiers aren't supported on <div> non Vue-components."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-bind.sync="foo()" /></template>',
      errors: [
        "'.sync' modifiers require the attribute value which is valid as LHS."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><svg><MyComponent :foo.sync="foo()" /></svg></template>',
      errors: [
        "'.sync' modifiers require the attribute value which is valid as LHS."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="foo?.bar" /></template>',
      errors: [
        "Optional chaining cannot appear in 'v-bind' with '.sync' modifiers."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="foo?.bar.baz" /></template>',
      errors: [
        "Optional chaining cannot appear in 'v-bind' with '.sync' modifiers."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="(a?.b)?.c" /></template>',
      errors: [
        "Optional chaining cannot appear in 'v-bind' with '.sync' modifiers."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="(a?.b).c" /></template>',
      errors: ["'.sync' modifier has potential null object property access."]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="(null).foo" /></template>',
      errors: ["'.sync' modifier has potential null object property access."]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent :foo.sync="(a?.b).c.d" /></template>',
      errors: ["'.sync' modifier has potential null object property access."]
    }
  ]
})
