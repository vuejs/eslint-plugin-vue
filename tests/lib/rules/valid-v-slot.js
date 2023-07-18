/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-slot')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
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
    </template>`,
    `<template>
      <MyComponent>
        <template v-for="(key, value) in xxxx" #[key]>{{value}}</template>
        <template v-for="(key, value) in yyyy" #[key]>{{value}}</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template #[key]>{{value}}</template>
        <template v-for="(key, value) in yyyy" #[key]>{{value}}</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template v-for="(value, key) in xxxx" #[key]>{{value}}</template>
        <template v-for="(key, value) in xxxx" #[key]>{{value}}</template>
      </MyComponent>
    </template>`,
    `<template>
      <MyComponent>
        <template v-for="(key) in xxxx" #[key+value]>{{value}}</template>
        <template v-for="(key, value) in xxxx" #[key+value]>{{value}}</template>
      </MyComponent>
    </template>`,
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo.bar></template>
          </MyComponent>
        </template>
      `,
      options: [{ allowModifiers: true }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo></template>
            <template v-slot:foo.bar></template>
            <template v-slot:foo.baz></template>
            <template v-slot:foo.bar.baz></template>
          </MyComponent>
        </template>
      `,
      options: [{ allowModifiers: true }]
    },
    // svg
    `
      <template>
        <svg>
          <MyComponent v-slot="slotProps">
            <MyChildComponent :thing="slotProps.thing" />
          </MyComponent>
        </svg>
      </template>
    `,
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-slot="." ><div /></MyComponent></template>'
    }
  ],
  invalid: [
    // Verify location.
    {
      code: `
        <template>
          <div v-slot="{data}">{{data}}</div>
        </template>
      `,
      errors: [{ messageId: 'ownerMustBeCustomElement', data: { name: 'div' } }]
    },
    {
      code: `
        <template>
          <template v-slot:named></template>
        </template>
      `,
      errors: [
        { messageId: 'ownerMustBeCustomElement', data: { name: 'template' } }
      ]
    },
    {
      code: `
        <template>
          <div v-slot:named="{data}">{{data}}</div>
        </template>
      `,
      errors: [
        { messageId: 'ownerMustBeCustomElement', data: { name: 'div' } },
        { messageId: 'namedSlotMustBeOnTemplate' }
      ]
    },
    {
      code: `
        <template>
          <div><template v-slot></template></div>
        </template>
      `,
      errors: [{ messageId: 'ownerMustBeCustomElement', data: { name: 'div' } }]
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
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key, value) in xxxx" v-slot:key>{{value}}</template>
            <template v-for="(key, value) in yyyy" v-slot:key>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [
        { messageId: 'disallowDuplicateSlotsOnChildren' },
        { messageId: 'disallowDuplicateSlotsOnChildren' },
        { messageId: 'disallowDuplicateSlotsOnChildren' }
      ]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key, value) in xxxx" v-slot:[key]>{{value}}</template>
            <template v-for="(key, value) in xxxx" v-slot:[key]>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key) in xxxx" v-slot:[key]>{{value}}</template>
            <template v-for="(key, value) in xxxx" v-slot:[key]>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [{ messageId: 'disallowDuplicateSlotsOnChildren' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo.bar></template>
            <template v-slot:foo.bar></template>
          </MyComponent>
        </template>
      `,
      options: [{ allowModifiers: true }],
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
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo.bar></template>
          </MyComponent>
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
      options: [{ allowModifiers: true }],
      errors: [{ messageId: 'disallowAnyModifier' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo.bar></template>
          </MyComponent>
        </template>
      `,
      options: [{ allowModifiers: false }],
      errors: [{ messageId: 'disallowAnyModifier' }]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo></template>
            <template v-slot:foo.bar></template>
            <template v-slot:foo.baz></template>
            <template v-slot:foo.bar.baz></template>
          </MyComponent>
        </template>
      `,
      options: [{ allowModifiers: false }],
      errors: [
        { messageId: 'disallowAnyModifier' },
        { messageId: 'disallowAnyModifier' },
        { messageId: 'disallowAnyModifier' }
      ]
    },

    // Verify value.
    {
      code: `
        <template>
          <MyComponent v-slot>content</MyComponent>
        </template>
      `,
      errors: [{ messageId: 'requireAttributeValue' }]
    },
    // comment value
    {
      filename: 'comment-value1.vue',
      code: '<template><MyComponent v-slot="/**/" ><div /></MyComponent></template>',
      errors: [{ messageId: 'requireAttributeValue' }]
    },
    {
      filename: 'comment-value2.vue',
      code: '<template><MyComponent v-slot=/**/ ><div /></MyComponent></template>',
      errors: [{ messageId: 'requireAttributeValue' }]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent v-slot="" ><div /></MyComponent></template>',
      errors: [{ messageId: 'requireAttributeValue' }]
    }
  ]
})
