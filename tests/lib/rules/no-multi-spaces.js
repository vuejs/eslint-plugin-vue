/**
 * @fileoverview This rule warns about the usage of extra whitespaces between attributes
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-multi-spaces')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
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
      options: [{
        ignoreProperties: true
      }]
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
      options: [{
        ignoreProperties: true
      }]
    }
  ],
  invalid: [
    {
      code: '<template><div     /></template>',
      output: '<template><div /></template>',
      errors: [{
        message: "Multiple spaces found before '/>'.",
        type: 'HTMLSelfClosingTagClose'
      }]
    },
    {
      code: '<template><div   class="foo"  /></template>',
      output: '<template><div class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before 'class'.",
          type: 'HTMLIdentifier'
        },
        {
          message: "Multiple spaces found before '/>'.",
          type: 'HTMLSelfClosingTagClose'
        }
      ]
    },
    {
      code: '<template><div\t\tclass="foo"\t\t/></template>',
      output: '<template><div class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before 'class'.",
          type: 'HTMLIdentifier'
        },
        {
          message: "Multiple spaces found before '/>'.",
          type: 'HTMLSelfClosingTagClose'
        }
      ]
    },
    {
      code: '<template><div   :class="foo"  /></template>',
      output: '<template><div :class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before ':'.",
          type: 'Punctuator'
        },
        {
          message: "Multiple spaces found before '/>'.",
          type: 'HTMLSelfClosingTagClose'
        }
      ]
    },
    {
      code: '<template><div :foo="" class="foo"  /></template>',
      output: '<template><div :foo="" class="foo" /></template>',
      errors: [{
        message: "Multiple spaces found before '/>'.",
        type: 'HTMLSelfClosingTagClose'
      }]
    },
    {
      code: '<template><div foo="" class="foo"  /></template>',
      output: '<template><div foo="" class="foo" /></template>',
      errors: [{
        message: "Multiple spaces found before '/>'.",
        type: 'HTMLSelfClosingTagClose'
      }]
    },
    {
      code: '<template><foo v-foo="" class="foo"  /></template>',
      output: '<template><foo v-foo="" class="foo" /></template>',
      errors: [{
        message: "Multiple spaces found before '/>'.",
        type: 'HTMLSelfClosingTagClose'
      }]
    },
    {
      code: '<template><foo v-foo="" \n         class="foo"    /></template>',
      output: '<template><foo v-foo="" \n         class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          type: 'HTMLSelfClosingTagClose'
        }
      ]
    },
    {
      code: '<template><div>{{  test  }}</div></template>',
      output: '<template><div>{{ test }}</div></template>',
      errors: [
        {
          message: "Multiple spaces found before 'test'.",
          type: 'Identifier'
        },
        {
          message: "Multiple spaces found before '}}'.",
          type: 'VExpressionEnd'
        }
      ]
    },
    {
      code: '<template><div               ></div></template>',
      output: '<template><div ></div></template>',
      errors: [
        {
          message: "Multiple spaces found before '>'.",
          type: 'HTMLTagClose'
        }
      ]
    },
    {
      code: '<template><div v-for="      i    in    b       ">{{ test }}</div></template>',
      output: '<template><div v-for=" i in b ">{{ test }}</div></template>',
      errors: [
        {
          message: "Multiple spaces found before 'i'.",
          type: 'Identifier'
        },
        {
          message: "Multiple spaces found before 'in'.",
          type: 'Keyword'
        },
        {
          message: "Multiple spaces found before 'b'.",
          type: 'Identifier'
        },
        {
          message: "Multiple spaces found before '\"'.",
          type: 'Punctuator'
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
          type: 'Punctuator'
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
          type: 'Identifier'
        }
      ]
    }
  ]
})
