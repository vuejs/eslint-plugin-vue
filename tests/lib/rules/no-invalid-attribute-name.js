/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-invalid-attribute-name')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-invalid-attribute-name', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p foo>
            {{ content }}
          </p>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p foo="bar">
            {{ content }}
          </p>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p foo-bar>
            {{ content }}
          </p>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p _foo-bar>
            {{ content }}
          </p>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p :foo-bar>
            {{ content }}
          </p>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p foo.bar>
            {{ content }}
          </p>
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p quux-.9>
            {{ content }}
          </p>
        </div>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p 0abc>
            {{ content }}
          </p>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Attribute name 0abc is not valid.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p -def>
            {{ content }}
          </p>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Attribute name -def is not valid.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p !ghi>
            {{ content }}
          </p>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Attribute name !ghi is not valid.'
        }
      ]
    }
  ]
})
