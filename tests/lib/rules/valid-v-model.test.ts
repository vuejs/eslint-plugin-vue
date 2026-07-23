/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-model'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
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
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:aaa="a"></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:aaa.modifier="a"></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.modifier="a"></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:aaa.modifier.modifierTwo="a"></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.modifier.modifierTwo="a"></MyComponent></template>'
    },
    // svg
    `
      <template>
        <svg>
          <MyComponent v-model="slotProps"></MyComponent>
        </svg>
      </template>
    `,
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-model="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-model="/**/" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a as string"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a!"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a as unknown as string"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a!!!!"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="(((a!) as unknown)! as string)!"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-model="foo"></div></template>',
      errors: [
        {
          message: "'v-model' directives aren't supported on <div> elements.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model:aaa="foo"></template>',
      errors: [
        {
          message: "'v-model' directives require no argument.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model.aaa="foo"></template>',
      errors: [
        {
          message: "'v-model' directives don't support the modifier 'aaa'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model></template>',
      errors: [
        {
          message: "'v-model' directives require that attribute value.",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="a + b"></template>',
      errors: [
        {
          message:
            "'v-model' directives require the attribute value which is valid as LHS.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input type="file" v-model="b"></template>',
      errors: [
        {
          message: "'v-model' directives don't support 'file' input type.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="x"></div></div></template>',
      errors: [
        {
          message:
            "'v-model' directives cannot update the iteration variable 'x' itself.",
          line: 1,
          column: 55,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="(x)"></div></div></template>',
      errors: [
        {
          message:
            "'v-model' directives cannot update the iteration variable 'x' itself.",
          line: 1,
          column: 56,
          endLine: 1,
          endColumn: 57
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list"><input v-model="(((x)))"></div></div></template>',
      errors: [
        {
          message:
            "'v-model' directives cannot update the iteration variable 'x' itself.",
          line: 1,
          column: 58,
          endLine: 1,
          endColumn: 59
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="e in list"><input v-model="e"></div></div></template>',
      errors: [
        {
          message:
            "'v-model' directives cannot update the iteration variable 'e' itself.",
          line: 1,
          column: 55,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent v-model="" /></template>',
      errors: [
        {
          message: "'v-model' directives require that attribute value.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="foo?.bar"></template>',
      errors: [
        {
          message: "Optional chaining cannot appear in 'v-model' directives.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="foo?.bar.baz"></template>',
      errors: [
        {
          message: "Optional chaining cannot appear in 'v-model' directives.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="(a?.b)?.c"></template>',
      errors: [
        {
          message: "Optional chaining cannot appear in 'v-model' directives.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="(a?.b).c"></template>',
      errors: [
        {
          message:
            "'v-model' directive has potential null object property access.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="(null).foo"></template>',
      errors: [
        {
          message:
            "'v-model' directive has potential null object property access.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><input v-model="(a?.b).c.d"></template>',
      errors: [
        {
          message:
            "'v-model' directive has potential null object property access.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a() as string"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            "'v-model' directives require the attribute value which is valid as LHS.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a()!"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            "'v-model' directives require the attribute value which is valid as LHS.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a() as unknown as string"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            "'v-model' directives require the attribute value which is valid as LHS.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 57
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="a()!!!!"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            "'v-model' directives require the attribute value which is valid as LHS.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="(((a()!) as unknown)! as string)!"></MyComponent></template>',
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            "'v-model' directives require the attribute value which is valid as LHS.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 66
        }
      ]
    }
  ]
})
