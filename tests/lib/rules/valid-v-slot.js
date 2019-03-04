/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-slot')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-slot', rule, {
  valid: [
    `<template>
      <MyComponent v-slot="{data}">{{data}}</MyComponent>
    </template>`,
    `<template>
      <MyComponent v-slot:default="{data}">{{data}}</MyComponent>
    </template>`,
    `<template>
      <MyComponent #default="{data}">{{data}}</MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template v-slot>default</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template #default>default</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template #named>named</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template #default>default</template>
        <template #named>named</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template #one>one</template>
        <template #two>two</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template #one>one</template>
        <template #two>two</template>
        <template #[one]>one</template>
        <template #[two]>two</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template v-if="condition" #one>foo</template>
        <template v-else #one>bar</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template v-if="c1" #one>foo</template>
        <template v-else-if="c2" #one>bar</template>
        <template v-else #one>baz</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template v-for="(key, value) in xxxx" #[key]>{{value}}</template>
      </MyComponent>
    </template>`
  ],
  invalid: [
    // Verify location.
    {
      code: `
        <template>
          <div v-slot="{data}">{{data}}</div>
        </template>
      `,
      errors: [{ messageId: 'ownerMustBeCustomElement', data: { name: 'div' }}]
    },
    {
      code: `
        <template>
          <template v-slot:named></template>
        </template>
      `,
      errors: [{ messageId: 'ownerMustBeCustomElement', data: { name: 'template' }}]
    },
    {
      code: `
        <template>
          <div v-slot:named="{data}">{{data}}</div>
        </template>
      `,
      errors: [
        { messageId: 'ownerMustBeCustomElement', data: { name: 'div' }},
        { messageId: 'namedSlotMustBeOnTemplate' }
      ]
    },
    {
      code: `
        <template>
          <div><template v-slot></template></div>
        </template>
      `,
      errors: [{ messageId: 'ownerMustBeCustomElement', data: { name: 'div' }}]
    },
    {
      code: `
        <template>
          <MyComponent v-slot:named="{data}">{{data}}</MyComponent>
        </template>
      `,
      errors: [{ messageId: 'namedSlotMustBeOnTemplate' }]
    },
    {
      code: `
        <template>
          <MyComponent v-slot="{data}">
            {{data}}
            <template #named></template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'defaultSlotMustBeOnTemplate' }]
    },

    // Verify duplication.
    {
      code: `
        <template>
          <MyComponent v-slot="{data}" v-slot:one>{{data}}</MyComponent>
        </template>
      `,
      errors: [
        { messageId: 'namedSlotMustBeOnTemplate' },
        { messageId: 'disallowDuplicateSlotsOnElement' }
      ]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:one v-slot:two></template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnElement' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:one>1st</template>
            <template v-slot:one>2nd</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:[one]>1st</template>
            <template v-slot:[one]>2nd</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot>1st</template>
            <template v-slot>2nd</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot>1st</template>
            <template v-slot:default>2nd</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-if="c1" v-slot:one>1st</template>
            <template v-slot:one>2nd</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-if="c1" v-slot:one>1st</template>
            <template v-else v-slot:one>2st</template>
            <template v-slot:one>3rd</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key, value) in definition" v-slot:one>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key, value) in definition" v-slot:[one]>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },

    // Verify arguments.
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:[data]="{data}"></template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowArgumentUseSlotParams' }]
    },

    // Verify modifiers.
    {
      code: `
        <template>
          <MyComponent v-slot.foo="{data}">{{data}}</MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowAnyModifier' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot.foo></template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowAnyModifier' }]
    },

    // Verify value.
    {
      code: `
        <template>
          <MyComponent v-slot>content</MyComponent>
        </template>
      `,
      errors: [{ messageId: 'requireAttributeValue' }]
    }
  ]
})
