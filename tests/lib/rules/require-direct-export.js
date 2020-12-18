/**
 * @fileoverview require the component to be directly exported
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-direct-export')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
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
    }
  ]
})
