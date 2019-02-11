/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/v-slot-style')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('v-slot-style', rule, {
  valid: [
    `
      <template>
        <my-component v-slot="data">
          <template #default></template>
          <template #foo></template>
        </my-component>
      </template>
    `,
    {
      code: `
        <template>
          <template>
            <my-component #default="data">
              <template #default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: ['shorthand']
    },
    {
      code: `
        <template>
          <template>
            <my-component v-slot:default="data">
              <template v-slot:default></template>
              <template v-slot:foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: ['longform']
    },

    {
      code: `
        <template>
          <template>
            <my-component #default="data">
              <template #default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ atComponent: 'shorthand' }]
    },
    {
      code: `
        <template>
          <template>
            <my-component v-slot:default="data">
              <template #default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ atComponent: 'longform' }]
    },
    {
      code: `
        <template>
          <template>
            <my-component v-slot="data">
              <template #default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ atComponent: 'v-slot' }]
    },

    {
      code: `
        <template>
          <template>
            <my-component v-slot="data">
              <template #default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ default: 'shorthand' }]
    },
    {
      code: `
        <template>
          <template>
            <my-component v-slot="data">
              <template v-slot:default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ default: 'longform' }]
    },
    {
      code: `
        <template>
          <template>
            <my-component v-slot="data">
              <template v-slot></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ default: 'v-slot' }]
    },

    {
      code: `
        <template>
          <template>
            <my-component v-slot="data">
              <template #default></template>
              <template #foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ named: 'shorthand' }]
    },
    {
      code: `
        <template>
          <template>
            <my-component v-slot="data">
              <template #default></template>
              <template v-slot:foo></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ named: 'longform' }]
    },
    {
      code: `
        <template>
          <template>
            <my-component>
              <template v-slot:[default]></template>
            </my-component>
          </template>
        </template>
      `,
      options: [{ named: 'longform' }]
    }
  ],

  invalid: [
    {
      code: `
        <template>
          <my-component #default="data"></my-component>
        </template>
      `,
      output: `
        <template>
          <my-component v-slot="data"></my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedVSlot', data: { actual: '#default', argument: 'default' }}]
    },
    {
      code: `
        <template>
          <my-component v-slot:default="data"></my-component>
        </template>
      `,
      output: `
        <template>
          <my-component v-slot="data"></my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedVSlot', data: { actual: 'v-slot:default', argument: 'default' }}]
    },
    {
      code: `
        <template>
          <my-component v-slot:default="data"></my-component>
        </template>
      `,
      output: `
        <template>
          <my-component #default="data"></my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedShorthand', data: { actual: 'v-slot:default', argument: 'default' }}],
      options: [{ atComponent: 'shorthand' }]
    },
    {
      code: `
        <template>
          <my-component v-slot="data"></my-component>
        </template>
      `,
      output: `
        <template>
          <my-component #default="data"></my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedShorthand', data: { actual: 'v-slot', argument: 'default' }}],
      options: [{ atComponent: 'shorthand' }]
    },
    {
      code: `
        <template>
          <my-component #default="data"></my-component>
        </template>
      `,
      output: `
        <template>
          <my-component v-slot:default="data"></my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedLongform', data: { actual: '#default', argument: 'default' }}],
      options: [{ atComponent: 'longform' }]
    },
    {
      code: `
        <template>
          <my-component v-slot="data"></my-component>
        </template>
      `,
      output: `
        <template>
          <my-component v-slot:default="data"></my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedLongform', data: { actual: 'v-slot', argument: 'default' }}],
      options: [{ atComponent: 'longform' }]
    },

    {
      code: `
        <template>
          <my-component>
            <template v-slot></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template #default></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedShorthand', data: { actual: 'v-slot', argument: 'default' }}]
    },
    {
      code: `
        <template>
          <my-component>
            <template v-slot:default></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template #default></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedShorthand', data: { actual: 'v-slot:default', argument: 'default' }}]
    },
    {
      code: `
        <template>
          <my-component>
            <template #default></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template v-slot:default></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedLongform', data: { actual: '#default', argument: 'default' }}],
      options: [{ default: 'longform' }]
    },
    {
      code: `
        <template>
          <my-component>
            <template v-slot></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template v-slot:default></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedLongform', data: { actual: 'v-slot', argument: 'default' }}],
      options: [{ default: 'longform' }]
    },
    {
      code: `
        <template>
          <my-component>
            <template #default></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template v-slot></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedVSlot', data: { actual: '#default', argument: 'default' }}],
      options: [{ default: 'v-slot' }]
    },
    {
      code: `
        <template>
          <my-component>
            <template v-slot:default></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template v-slot></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedVSlot', data: { actual: 'v-slot:default', argument: 'default' }}],
      options: [{ default: 'v-slot' }]
    },

    {
      code: `
        <template>
          <my-component>
            <template v-slot:foo></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template #foo></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedShorthand', data: { actual: 'v-slot:foo', argument: 'foo' }}]
    },
    {
      code: `
        <template>
          <my-component>
            <template #foo></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template v-slot:foo></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedLongform', data: { actual: '#foo', argument: 'foo' }}],
      options: [{ named: 'longform' }]
    },

    {
      code: `
        <template>
          <my-component>
            <template v-slot:[foo]></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template #[foo]></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedShorthand', data: { actual: 'v-slot:[foo]', argument: '[foo]' }}]
    },
    {
      code: `
        <template>
          <my-component>
            <template #[foo]></template>
          </my-component>
        </template>
      `,
      output: `
        <template>
          <my-component>
            <template v-slot:[foo]></template>
          </my-component>
        </template>
      `,
      errors: [{ messageId: 'expectedLongform', data: { actual: '#[foo]', argument: '[foo]' }}],
      options: [{ named: 'longform' }]
    }
  ]
})
