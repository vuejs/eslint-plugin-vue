'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-use-v-else-with-v-for')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-use-v-else-with-v-for', rule, {
  valid: [
    {
      // caught by `vue/no-use-v-if-with-v-for`
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="foo" v-for="x in xs">{{ x }}</div>
        </template>
      `
    },
    {
      // `v-if`/`v-else-if`/`v-else` only
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="foo">{{ x }}</div>
          <div v-else-if="foo">{{ x }}</div>
          <div v-else="foo">{{ x }}</div>
        </template>
      `
    },
    {
      // `v-for` only
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="x in xs">{{ x }}</div>
        </template>
      `
    },
    {
      // `v-else-if`/`v-else` in template + `v-for`
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="foo">foo</div>
          <template v-else-if="bar">
            <div v-for="x in xs">{{ x }}</div>
          </template>
          <template v-else>
            <div v-for="x in xs">{{ x }}</div>
          </template>
        </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="foo">foo</div>
          <div v-else v-for="x in xs">{{ x }}</div>
        </template>
      `,
      errors: [
        {
          message:
            'Unexpected `v-else` and `v-for` on the same element. Move `v-else` to a wrapper element instead.',
          line: 4,
          endLine: 4,
          column: 11,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="foo">foo</div>
          <div v-else-if="bar" v-for="x in xs">{{ x }}</div>
        </template>
      `,
      errors: [
        {
          message:
            'Unexpected `v-else-if` and `v-for` on the same element. Move `v-else-if` to a wrapper element instead.',
          line: 4,
          endLine: 4,
          column: 11,
          endColumn: 61
        }
      ]
    }
  ]
})
