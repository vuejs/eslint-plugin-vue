/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-slot-scope')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2018 }
})

tester.run('valid-slot-scope', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="slotProps">
              {{slotProps.name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope='slotProps'>
              {{slotProps.name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope=slotProps>
              {{slotProps.name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="{name}">
              {{name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope='{name}'>
              {{name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope={name}>
              {{name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="slotProps = { name: 'default' }">
              {{slotProps.name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="[a, b]">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="[a, ...b]">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="{a, ...b}">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="     slotProps     ">
              {{slotProps.name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope=" /*comment*/ slotProps /*comment*/ ">
              {{slotProps.name}}
            </div>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template scope="slotProps">
              <div>
                {{slotProps.name}}
              </div>
            </template>
          </MyComponent>
        </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope />
          </MyComponent>
        </template>
      `,
      errors: [{
        message: "'slot-scope' attributes require a value.",
        line: 4,
        column: 18,
        endColumn: 28
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="" />
          </MyComponent>
        </template>
      `,
      errors: [{
        message: "'slot-scope' attributes require a value.",
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template scope="">
              <div />
            </template>
          </MyComponent>
        </template>
      `,
      errors: [{
        message: "'scope' attributes require a value.",
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="...args">
              {{args}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [{
        message: 'The top level rest parameter is useless.',
        line: 4,
        column: 30,
        endColumn: 37
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="a, b  ">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [{
        message: 'Unexpected extra access parameters `b`.',
        line: 4,
        column: 31,
        endColumn: 34
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="{a} , b">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [{
        message: 'Unexpected extra access parameters `b`.',
        line: 4,
        column: 34,
        endColumn: 37
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="a, b, c, d /**/">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [{
        message: 'Unexpected extra access parameters `b, c, d`.',
        line: 4,
        column: 31,
        endColumn: 40
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope='a, b'>
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [
        'Unexpected extra access parameters `b`.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope=a,b>
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [
        'Unexpected extra access parameters `b`.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope=a,{b}>
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [
        'Unexpected extra access parameters `{b}`.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope=a,[b]>
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [
        'Unexpected extra access parameters `[b]`.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope="a,">
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [
        'Unexpected trailing comma.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <div slot-scope=a,>
              {{a}}
            </div>
          </MyComponent>
        </template>
      `,
      errors: [
        'Unexpected trailing comma.'
      ]
    }
  ]
})
