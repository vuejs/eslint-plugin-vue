/**
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 * @copyright 2017 薛定谔的猫. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unused-vars')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-unused-vars', rule, {
  valid: [
    {
      code: '<template><ol v-for="i in 5"><li>{{i}}</li></ol></template>'
    },
    {
      code: '<template><ol v-for="i in 5"><li :prop="i"></li></ol></template>'
    },
    {
      code: '<template v-for="i in 5"><comp v-for="j in 10">{{i}}{{j}}</comp></template>'
    },
    {
      code: '<template><ol v-for="i in data"><li v-for="f in i">{{ f.bar.baz }}</li></ol></template>'
    },
    {
      code: '<template><template scope="props">{{props}}</template></template>'
    },
    {
      code: '<template><template scope="props"><span v-if="props"></span></template></template>'
    },
    {
      code: '<template><div v-for="(item, key) in items" :key="key">{{item.name}}</div></template>'
    },
    {
      code: '<template><div v-for="(v, i, c) in foo">{{c}}</div></template>'
    },
    {
      code: '<template><div v-for="x in foo">{{value | f(x)}}</div></template>'
    },
    {
      code: '<template><div v-for="x in foo" :[x]></div></template>'
    }
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
      errors: ["'a' is defined but never used.", "'b' is defined but never used.", "'c' is defined but never used."]
    },
    {
      code: '<template><div v-for="(a, b, c) in foo">{{a}}</div></template>',
      errors: ["'b' is defined but never used.", "'c' is defined but never used."]
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
      errors: ["'x' is defined but never used."]
    }
  ]
})
