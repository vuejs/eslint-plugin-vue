/**
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 * @copyright 2017 薛定谔的猫. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-unused-vars')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
      errors: ["'i' is defined but never used."]
    },
    {
      code: '<template><template scope="props"></template></template>',
      errors: ["'props' is defined but never used."]
    },
    {
      code: '<template><span slot-scope="props"></span></template>',
      errors: ["'props' is defined but never used."]
    },
    {
      code: '<template><span><template scope="props"></template></span></template>',
      errors: ["'props' is defined but never used."]
    },
    {
      code: '<template><div v-for="i in 5"><comp v-for="j in 10">{{i}}{{i}}</comp></div></template>',
      errors: ["'j' is defined but never used."]
    },
    {
      code: '<template><ol v-for="i in data"><li v-for="f in i"></li></ol></template>',
      errors: ["'f' is defined but never used."]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo"></div></template>',
      errors: [
        "'a' is defined but never used.",
        "'b' is defined but never used.",
        "'c' is defined but never used."
      ]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo">{{a}}</div></template>',
      errors: [
        "'b' is defined but never used.",
        "'c' is defined but never used."
      ]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo">{{b}}</div></template>',
      errors: ["'c' is defined but never used."]
    },
    {
      code: '<template><div v-for="(item, key) in items" :key="item.id">{{item.name}}</div></template>',
      errors: ["'key' is defined but never used."]
    },
    {
      code: '<template><div v-for="x in items">{{value | x}}</div></template>',
      options: [{ ignorePattern: '^_' }],
      errors: [
        {
          message: "'x' is defined but never used.",
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
      errors: ["'x' is defined but never used."]
    },
    {
      code: '<template><span slot-scope="props"></span></template>',
      options: [{ ignorePattern: '^ignore' }],
      errors: ["'props' is defined but never used."]
    },
    {
      code: '<template><span><template scope="props"></template></span></template>',
      options: [{ ignorePattern: '^ignore' }],
      errors: ["'props' is defined but never used."]
    },
    {
      code: '<template><div v-for="_i in foo" ></div></template>',
      errors: ["'_i' is defined but never used."]
    },
    {
      code: '<template><div v-for="(a, _i) in foo" ></div></template>',
      options: [{ ignorePattern: '^_' }],
      errors: [
        {
          message: "'a' is defined but never used.",
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
      errors: ["'a' is defined but never used."]
    },
    {
      code: '<template><my-component v-for="i in foo" v-slot="a" >{{a}}</my-component></template>',
      errors: ["'i' is defined but never used."]
    },
    {
      code: '<template><my-component v-for="i in foo" v-slot="a" >{{i}}</my-component></template>',
      errors: ["'a' is defined but never used."]
    },
    {
      code: '<template><div v-for="({a, b}, [c, d], e, f) in foo" >{{f}}</div></template>',
      errors: [
        "'a' is defined but never used.",
        "'b' is defined but never used.",
        "'c' is defined but never used.",
        "'d' is defined but never used."
      ]
    },
    {
      code: '<template><div v-for="({a, b}, c, [d], e, f) in foo" >{{f}}</div></template>',
      errors: [
        "'a' is defined but never used.",
        "'b' is defined but never used.",
        "'d' is defined but never used."
      ]
    },
    {
      code: '<template><my-component v-slot="{a, b, c, d}" >{{d}}</my-component></template>',
      errors: [
        "'a' is defined but never used.",
        "'b' is defined but never used.",
        "'c' is defined but never used."
      ]
    },
    {
      code: '<template><div v-for="({a, b: bar}, c = 1, [d], e, f) in foo" >{{f}}</div></template>',
      errors: [
        "'a' is defined but never used.",
        "'bar' is defined but never used.",
        "'d' is defined but never used."
      ]
    },
    // Slot prop used as component tag in sibling slot (different scope)
    {
      code: '<template><my-component><template #a="{ Comp }"></template><template #b><Comp /></template></my-component></template>',
      errors: ["'Comp' is defined but never used."]
    },
    // Slot prop with same name exists as tag but in parent scope
    {
      code: '<template><my-component v-slot="{ Comp }"><other-component v-slot="props"><Comp /></other-component></my-component></template>',
      errors: ["'props' is defined but never used."]
    }
  ]
})
