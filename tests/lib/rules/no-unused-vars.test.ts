/**
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 * @copyright 2017 薛定谔的猫. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-unused-vars'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('no-unused-vars', rule, {
  valid: [
    '<template><ol v-for="i in 5"><li>{{i}}</li></ol></template>',
    '<template><ol v-for="i in 5"><li :prop="i"></li></ol></template>',
    '<template v-for="i in 5"><comp v-for="j in 10">{{i}}{{j}}</comp></template>',
    '<template><ol v-for="i in data"><li v-for="f in i">{{ f.bar.baz }}</li></ol></template>',
    '<template><template scope="props">{{props}}</template></template>',
    '<template><template scope="props"><span v-if="props"></span></template></template>',
    '<template><div v-for="(item, key) in items" :key="key">{{item.name}}</div></template>',
    '<template><div v-for="(v, i, c) in foo">{{c}}</div></template>',
    '<template><div v-for="x in foo">{{value | f(x)}}</div></template>',
    '<template><div v-for="x in foo" :[x]></div></template>',
    {
      code: '<template><div v-for="_ in foo" ></div></template>',
      options: [{ ignorePattern: '^_' }]
    },
    {
      code: '<template><div v-for="ignorei in foo" ></div></template>',
      options: [{ ignorePattern: '^ignore' }]
    },
    {
      code: '<template><div v-for="thisisignore in foo" ></div></template>',
      options: [{ ignorePattern: 'ignore$' }]
    },
    // Slot prop used as component tag
    '<template><my-component v-slot="{ Comp }"><Comp /></my-component></template>',
    '<template><my-component v-slot="{ Comp }"><Comp>content</Comp></my-component></template>',
    '<template><my-component v-slot="{ Iteration }"><div><Iteration v-for="i in items" :key="i" /></div></my-component></template>',
    '<template><my-component #default="{ Comp }"><Comp /></my-component></template>',
    '<template><my-component #wrapper="{ items, Iteration }"><Iteration v-for="(key, index) in items" :key="key" :index="index" /></my-component></template>',
    // Slot prop used both as component tag and via :is (references)
    '<template><my-component v-slot="{ Comp }"><component :is="Comp" /></my-component></template>',
    // Multiple slot props, some used as tags, some via references
    '<template><my-component v-slot="{ Comp, data }"><Comp>{{ data }}</Comp></my-component></template>',
    // Deeply nested component tag usage
    '<template><my-component v-slot="{ Comp }"><div><span><Comp /></span></div></my-component></template>'
  ],
  invalid: [
    {
      code: '<template><ol v-for="i in 5"><li></li></ol></template>',
      errors: [
        {
          message: "'i' is defined but never used.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><template scope="props"></template></template>',
      errors: [
        {
          message: "'props' is defined but never used.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: '<template><span slot-scope="props"></span></template>',
      errors: [
        {
          message: "'props' is defined but never used.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: '<template><span><template scope="props"></template></span></template>',
      errors: [
        {
          message: "'props' is defined but never used.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: '<template><div v-for="i in 5"><comp v-for="j in 10">{{i}}{{i}}</comp></div></template>',
      errors: [
        {
          message: "'j' is defined but never used.",
          line: 1,
          column: 44,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      code: '<template><ol v-for="i in data"><li v-for="f in i"></li></ol></template>',
      errors: [
        {
          message: "'f' is defined but never used.",
          line: 1,
          column: 44,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo"></div></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        },
        {
          message: "'b' is defined but never used.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28
        },
        {
          message: "'c' is defined but never used.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo">{{a}}</div></template>',
      errors: [
        {
          message: "'b' is defined but never used.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28
        },
        {
          message: "'c' is defined but never used.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo">{{b}}</div></template>',
      errors: [
        {
          message: "'c' is defined but never used.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: '<template><div v-for="(item, key) in items" :key="item.id">{{item.name}}</div></template>',
      errors: [
        {
          message: "'key' is defined but never used.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: '<template><div v-for="x in items">{{value | x}}</div></template>',
      options: [{ ignorePattern: '^_' }],
      errors: [
        {
          message: "'x' is defined but never used.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24,
          suggestions: [
            {
              desc: 'Replace `x` with `_x` to ignore the unused variable.',
              output:
                '<template><div v-for="_x in items">{{value | x}}</div></template>'
            }
          ]
        }
      ]
    },
    {
      code: '<template><div v-for="x in items">{{value}}</div></template>',
      options: [{ ignorePattern: 'ignore$' }],
      errors: [
        {
          message: "'x' is defined but never used.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><span slot-scope="props"></span></template>',
      options: [{ ignorePattern: '^ignore' }],
      errors: [
        {
          message: "'props' is defined but never used.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: '<template><span><template scope="props"></template></span></template>',
      options: [{ ignorePattern: '^ignore' }],
      errors: [
        {
          message: "'props' is defined but never used.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: '<template><div v-for="_i in foo" ></div></template>',
      errors: [
        {
          message: "'_i' is defined but never used.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div v-for="(a, _i) in foo" ></div></template>',
      options: [{ ignorePattern: '^_' }],
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25,
          suggestions: [
            {
              messageId: 'replaceWithUnderscore',
              output:
                '<template><div v-for="(_a, _i) in foo" ></div></template>'
            }
          ]
        }
      ]
    },
    {
      code: '<template><my-component v-slot="a" >{{d}}</my-component></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: '<template><my-component v-for="i in foo" v-slot="a" >{{a}}</my-component></template>',
      errors: [
        {
          message: "'i' is defined but never used.",
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: '<template><my-component v-for="i in foo" v-slot="a" >{{i}}</my-component></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 50,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      code: '<template><div v-for="({a, b}, [c, d], e, f) in foo" >{{f}}</div></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        },
        {
          message: "'b' is defined but never used.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        },
        {
          message: "'c' is defined but never used.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "'d' is defined but never used.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: '<template><div v-for="({a, b}, c, [d], e, f) in foo" >{{f}}</div></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        },
        {
          message: "'b' is defined but never used.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        },
        {
          message: "'d' is defined but never used.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: '<template><my-component v-slot="{a, b, c, d}" >{{d}}</my-component></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 35
        },
        {
          message: "'b' is defined but never used.",
          line: 1,
          column: 37,
          endLine: 1,
          endColumn: 38
        },
        {
          message: "'c' is defined but never used.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      code: '<template><div v-for="({a, b: bar}, c = 1, [d], e, f) in foo" >{{f}}</div></template>',
      errors: [
        {
          message: "'a' is defined but never used.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        },
        {
          message: "'bar' is defined but never used.",
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "'d' is defined but never used.",
          line: 1,
          column: 45,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    // Slot prop used as component tag in sibling slot (different scope)
    {
      code: '<template><my-component><template #a="{ Comp }"></template><template #b><Comp /></template></my-component></template>',
      errors: [
        {
          message: "'Comp' is defined but never used.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    // Slot prop with same name exists as tag but in parent scope
    {
      code: '<template><my-component v-slot="{ Comp }"><other-component v-slot="props"><Comp /></other-component></my-component></template>',
      errors: [
        {
          message: "'props' is defined but never used.",
          line: 1,
          column: 68,
          endLine: 1,
          endColumn: 73
        }
      ]
    }
  ]
})
