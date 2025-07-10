/**
 * @author Wayne
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-negated-condition')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-negated-condition', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo" />
        <div v-if="bar" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo" />
        <div v-else-if="bar" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo" />
        <div v-else-if="!bar" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a != b" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a !== b" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a != b" />
        <div v-else-if="c" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a !== b" />
        <div v-else-if="c" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!foo" />
        <div v-else-if="!bar" />
        <div v-else-if="baz" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!a" />
        <div v-else-if="b" />
        <div v-else />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else-if="bar" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo && bar" />
        <div v-else />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo">
          <span v-if="!bar" />
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
        <div v-if="!foo" />
        <div v-else />
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!(foo && bar)" />
        <div v-else />
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a != b" />
        <div v-else />
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a !== b" />
        <div v-else />
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 3,
          column: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else-if="!bar" />
        <div v-else />
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="!a" />
        <div v-else-if="!b" />
        <div v-else />
      </template>
      `,
      errors: [
        {
          messageId: 'negatedCondition',
          line: 4,
          column: 25
        }
      ]
    }
  ]
})
