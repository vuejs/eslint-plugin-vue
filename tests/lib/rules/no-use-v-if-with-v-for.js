/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-use-v-if-with-v-for')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-use-v-if-with-v-for', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="x"></div></div></template>',
      options: [{ allowUsingIterationVar: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="x.foo"></div></div></template>',
      options: [{ allowUsingIterationVar: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="(x,i) in list" v-if="i%2==0"></div></div></template>',
      options: [{ allowUsingIterationVar: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="shown"><div v-for="(x,i) in list"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <ul>
            <li
              v-for="user in activeUsers"
              :key="user.id"
            >
              {{ user.name }}
            <li>
          </ul>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <ul v-if="shouldShowUsers">
            <li
              v-for="user in users"
              :key="user.id"
            >
              {{ user.name }}
            <li>
          </ul>
        </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="shown"></div></div></template>',
      errors: [{
        message: "This 'v-if' should be moved to the wrapper element.",
        line: 1
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="list.length&gt;0"></div></div></template>',
      errors: [{
        message: "This 'v-if' should be moved to the wrapper element.",
        line: 1
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div v-for="x in list" v-if="x.isActive"></div></div></template>',
      errors: [{
        message: "The 'list' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
        line: 1
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <ul>
            <li
              v-for="user in users"
              v-if="user.isActive"
              :key="user.id"
            >
              {{ user.name }}
            <li>
          </ul>
        </template>
      `,
      errors: [{
        message: "The 'users' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <ul>
            <li
              v-for="user in users"
              v-if="shouldShowUsers"
              :key="user.id"
            >
              {{ user.name }}
            <li>
          </ul>
        </template>
      `,
      errors: [{
        message: "This 'v-if' should be moved to the wrapper element.",
        line: 6
      }]
    }
  ]
})
