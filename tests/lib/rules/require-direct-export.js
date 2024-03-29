/**
 * @fileoverview require the component to be directly exported
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

const rule = require('../../../lib/rules/require-direct-export')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  }
})
ruleTester.run('require-direct-export', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `export default {}`
    },
    {
      filename: 'test.vue',
      code: `export default {}`,
      options: [{ disallowFunctionalComponentFunction: true }]
    },
    {
      filename: 'test.js',
      code: `export default Foo`
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default function (props) {
        return h('div', \`Hello! \${props.name}\`)
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default function Component () {
        return h('div')
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default (props) => {
        return h('div', \`Hello! \${props.name}\`)
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default props => h('div', props.msg)
      `
    },
    {
      filename: 'test.vue',
      code: `
      import Vue from 'vue'
      export default Vue.extend({})
      `
    },
    {
      filename: 'test.vue',
      code: `
      import { defineComponent } from 'vue'
      export default defineComponent({})
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      const A = {};
      export default A`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      function A(props) {
        return h('div', props.msg)
      };
      export default A`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default function NoReturn() {}`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default function () {}`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default () => {}`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default () => {
        const foo = () => {
          return b
        }
      }`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default () => {
        return
      }`,
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      function A(props) {
        return h('div', props.msg)
      };
      export default A`,
      options: [{ disallowFunctionalComponentFunction: true }],
      errors: [
        {
          message: 'Expected the component literal to be directly exported.',
          type: 'ExportDefaultDeclaration',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default function (props) {
        return h('div', \`Hello! \${props.name}\`)
      }
      `,
      options: [{ disallowFunctionalComponentFunction: true }],
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default function Component () {
        return h('div')
      }
      `,
      options: [{ disallowFunctionalComponentFunction: true }],
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default (props) => {
        return h('div', \`Hello! \${props.name}\`)
      }
      `,
      options: [{ disallowFunctionalComponentFunction: true }],
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import { h } from 'vue'
      export default props => h('div', props.msg)
      `,
      options: [{ disallowFunctionalComponentFunction: true }],
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import Vue from 'vue'
      export default Vue.extend()
      `,
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import Vue from 'vue'
      const A = {}
      export default Vue.extend(A)
      `,
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import { defineComponent } from 'vue'
      export default defineComponent()
      `,
      errors: ['Expected the component literal to be directly exported.']
    },
    {
      filename: 'test.vue',
      code: `
      import { defineComponent } from 'vue'
      const A = {}
      export default defineComponent(A)
      `,
      errors: ['Expected the component literal to be directly exported.']
    }
  ]
})
