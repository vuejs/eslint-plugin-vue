'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/v-on-event-hyphenation.js')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('v-on-event-hyphenation', rule, {
  valid: [
    `
    <template>
        <VueComponent @custom-event="onEvent"/>
    </template>
    `,
    `
    <template>
        <VueComponent :customEvent="onEvent"/>
    </template>
    `,
    `
    <template>
        <VueComponent v-on="events"/>
    </template>
    `,
    `
    <template>
        <div v-on:unknownEvent="onEvent"/>
    </template>
    `,
    {
      code: `
      <template>
          <VueComponent v-on:customEvent="events"/>
      </template>
      `,
      options: ['never']
    },
    {
      code: `
      <template>
          <VueComponent v-on:customEvent="events"/>
      </template>
      `,
      options: ['never', { ignore: ['custom'] }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
          <VueComponent @customEvent="onEvent"/>
      </template>
      `,
      output: null,
      errors: [
        {
          message: "v-on event '@customEvent' must be hyphenated.",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 47
        }
      ]
    },
    {
      code: `
      <template>
          <VueComponent @customEvent="onEvent"/>
      </template>
      `,
      options: ['always', { autofix: true }],
      output: `
      <template>
          <VueComponent @custom-event="onEvent"/>
      </template>
      `,
      errors: [
        {
          message: "v-on event '@customEvent' must be hyphenated.",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 47
        }
      ]
    },
    {
      code: `
      <template>
          <VueComponent v-on:custom-event="events"/>
      </template>
      `,
      options: ['never', { autofix: true }],
      output: `
      <template>
          <VueComponent v-on:customEvent="events"/>
      </template>
      `,
      errors: ["v-on event 'v-on:custom-event' can't be hyphenated."]
    }
  ]
})
