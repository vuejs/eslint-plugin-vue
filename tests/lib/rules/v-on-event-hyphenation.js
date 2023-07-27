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
      output: `
      <template>
          <VueComponent @custom-event="onEvent"/>
      </template>
      `,
      options: ['always', { autofix: true }],
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
      output: `
      <template>
          <VueComponent v-on:customEvent="events"/>
      </template>
      `,
      options: ['never', { autofix: true }],
      errors: ["v-on event 'v-on:custom-event' can't be hyphenated."]
    },
    {
      code: `
      <template>
        <VueComponent @update:modelValue="foo"/>
        <VueComponent @update:model-value="foo"/>
      </template>
      `,
      output: `
      <template>
        <VueComponent @update:model-value="foo"/>
        <VueComponent @update:model-value="foo"/>
      </template>
      `,
      options: ['always', { autofix: true }],
      errors: ["v-on event '@update:modelValue' must be hyphenated."]
    },
    {
      code: `
      <template>
        <VueComponent @update:modelValue="foo"/>
        <VueComponent @update:model-value="foo"/>
      </template>
      `,
      output: `
      <template>
        <VueComponent @update:modelValue="foo"/>
        <VueComponent @update:modelValue="foo"/>
      </template>
      `,
      options: ['never', { autofix: true }],
      errors: ["v-on event '@update:model-value' can't be hyphenated."]
    },
    {
      code: `
      <template>
        <VueComponent @upDate:modelValue="foo"/>
        <VueComponent @up-date:modelValue="foo"/>
        <VueComponent @upDate:model-value="foo"/>
        <VueComponent @up-date:model-value="foo"/>
      </template>
      `,
      output: `
      <template>
        <VueComponent @up-date:model-value="foo"/>
        <VueComponent @up-date:model-value="foo"/>
        <VueComponent @up-date:model-value="foo"/>
        <VueComponent @up-date:model-value="foo"/>
      </template>
      `,
      options: ['always', { autofix: true }],
      errors: [
        "v-on event '@upDate:modelValue' must be hyphenated.",
        "v-on event '@up-date:modelValue' must be hyphenated.",
        "v-on event '@upDate:model-value' must be hyphenated."
      ]
    },
    {
      code: `
      <template>
        <VueComponent @upDate:modelValue="foo"/>
        <VueComponent @up-date:modelValue="foo"/>
        <VueComponent @upDate:model-value="foo"/>
        <VueComponent @up-date:model-value="foo"/>
      </template>
      `,
      output: `
      <template>
        <VueComponent @upDate:modelValue="foo"/>
        <VueComponent @upDate:modelValue="foo"/>
        <VueComponent @upDate:modelValue="foo"/>
        <VueComponent @upDate:modelValue="foo"/>
      </template>
      `,
      options: ['never', { autofix: true }],
      errors: [
        "v-on event '@up-date:modelValue' can't be hyphenated.",
        "v-on event '@upDate:model-value' can't be hyphenated.",
        "v-on event '@up-date:model-value' can't be hyphenated."
      ]
    }
  ]
})
