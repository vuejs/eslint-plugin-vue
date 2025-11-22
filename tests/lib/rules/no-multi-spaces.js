/**
 * @fileoverview This rule warns about the usage of extra whitespaces between attributes
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/no-multi-spaces')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

ruleTester.run('no-multi-spaces', rule, {
  valid: [
    '',
    '<template></template>',
    '<template><div /></template>',
    '<template><div class="foo"></div></template>',
    '<template><div class="     foo   " style="     foo   "></div></template>',
    '<template><div class="foo" @click="bar"></div></template>',
    '<template><div class="foo"\n          :style="foo"></div></template>',
    '<template><div class="foo"\n\t\t\t:style="foo"></div></template>',
    '<template><div class="foo"\n      :style="foo"\n      ></div></template>',
    '<template><div class="foo"\n                       :style="foo" /></template>',
    '<template><div class="foo"\n                       :style="foo"\n                            /></template>',
    '<template><div>{{ test }}</div></template>',
    '<template><div>{{test}}</div></template>',
    '<template><div>{{test}}<!-- fooo --></div></template>',
    '<template><div>{{test}} <!--        fooo           --></div></template>',
    '<template><div v-for="i in b">{{ i }}</div></template>',
    '<template><div v-for=" i in b ">{{ i }}</div></template>',
    '<template><div :test="`           `"> {{ a }} </div></template>',
    '<template><div :test="`           `">          \n        {{ a }} </div></template>',
    {
      filename: 'test.js',
      code: 'export default { }'
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up'   : isExpanded,
            'fa-angle-down' : !isExpanded,
          }"
        />
      </template>
      `,
      options: [
        {
          ignoreProperties: true
        }
      ]
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up':   isExpanded,
            'fa-angle-down': !isExpanded,
          }"
        />
      </template>
      `,
      options: [
        {
          ignoreProperties: true
        }
      ]
    }
  ],
  invalid: [
    {
      code: '<template><div     /></template>',
      output: '<template><div /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: '<template><div   class="foo"  /></template>',
      output: '<template><div class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before 'class'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: '<template><div\t\tclass="foo"\t\t/></template>',
      output: '<template><div class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before 'class'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div   :class="foo"  /></template>',
      output: '<template><div :class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before ':'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: '<template><div :foo="" class="foo"  /></template>',
      output: '<template><div :foo="" class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 35,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: '<template><div foo="" class="foo"  /></template>',
      output: '<template><div foo="" class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: '<template><foo v-foo="" class="foo"  /></template>',
      output: '<template><foo v-foo="" class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      code: '<template><foo v-foo="" \n         class="foo"    /></template>',
      output: '<template><foo v-foo="" \n         class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div>{{  test  }}</div></template>',
      output: '<template><div>{{ test }}</div></template>',
      errors: [
        {
          message: "Multiple spaces found before 'test'.",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 20
        },
        {
          message: "Multiple spaces found before '}}'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div               ></div></template>',
      output: '<template><div ></div></template>',
      errors: [
        {
          message: "Multiple spaces found before '>'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div v-for="      i    in    b       ">{{ test }}</div></template>',
      output: '<template><div v-for=" i in b ">{{ test }}</div></template>',
      errors: [
        {
          message: "Multiple spaces found before 'i'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 29
        },
        {
          message: "Multiple spaces found before 'in'.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Multiple spaces found before 'b'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 40
        },
        {
          message: "Multiple spaces found before '\"'.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up'   : isExpanded,
            'fa-angle-down' : !isExpanded,
          }"
        />
      </template>
      `,
      output: `
      <template>
        <i
          :class="{
            'fa-angle-up' : isExpanded,
            'fa-angle-down' : !isExpanded,
          }"
        />
      </template>
      `,
      errors: [
        {
          message: "Multiple spaces found before ':'.",
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 29
        }
      ]
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up':   isExpanded,
            'fa-angle-down': !isExpanded,
          }"
        />
      </template>
      `,
      output: `
      <template>
        <i
          :class="{
            'fa-angle-up': isExpanded,
            'fa-angle-down': !isExpanded,
          }"
        />
      </template>
      `,
      errors: [
        {
          message: "Multiple spaces found before 'isExpanded'.",
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 30
        }
      ]
    }
  ]
})
