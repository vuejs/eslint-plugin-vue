/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-slot'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
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
      errors: [
        {
          messageId: 'ownerMustBeCustomElement',
          data: { name: 'div' },
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 31
        }
      ]
    },
    {
      code: `
        <template>
          <template v-slot:named></template>
        </template>
      `,
      errors: [
        {
          messageId: 'ownerMustBeCustomElement',
          data: { name: 'template' },
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 33
        }
      ]
    },
    {
      code: `
        <template>
          <div v-slot:named="{data}">{{data}}</div>
        </template>
      `,
      errors: [
        {
          messageId: 'ownerMustBeCustomElement',
          data: { name: 'div' },
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 37
        },
        {
          messageId: 'namedSlotMustBeOnTemplate',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 37
        }
      ]
    },
    {
      code: `
        <template>
          <div><template v-slot></template></div>
        </template>
      `,
      errors: [
        {
          messageId: 'ownerMustBeCustomElement',
          data: { name: 'div' },
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 32
        }
      ]
    },
    {
      code: `
        <template>
          <MyComponent v-slot:named="{data}">{{data}}</MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'namedSlotMustBeOnTemplate',
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 45
        }
      ]
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
      errors: [
        {
          messageId: 'defaultSlotMustBeOnTemplate',
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 39
        }
      ]
    },

    // Verify duplication.
    {
      code: `
        <template>
          <MyComponent v-slot="{data}" v-slot:one>{{data}}</MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'namedSlotMustBeOnTemplate',
          line: 3,
          column: 40,
          endLine: 3,
          endColumn: 50
        },
        {
          messageId: 'disallowDuplicateSlotsOnElement',
          line: 3,
          column: 40,
          endLine: 3,
          endColumn: 50
        }
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnElement',
          line: 4,
          column: 34,
          endLine: 4,
          endColumn: 44
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 33
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 35
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 29
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 37
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 33
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 6,
          column: 23,
          endLine: 6,
          endColumn: 33
        }
      ]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key, value) in definition" v-slot:one>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 4,
          column: 58,
          endLine: 4,
          endColumn: 68
        }
      ]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-for="(key, value) in definition" v-slot:[one]>{{value}}</template>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 4,
          column: 58,
          endLine: 4,
          endColumn: 70
        }
      ]
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
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 4,
          column: 52,
          endLine: 4,
          endColumn: 62
        },
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 52,
          endLine: 5,
          endColumn: 62
        },
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 52,
          endLine: 5,
          endColumn: 62
        }
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 52,
          endLine: 5,
          endColumn: 64
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 52,
          endLine: 5,
          endColumn: 64
        }
      ]
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
      errors: [
        {
          messageId: 'disallowDuplicateSlotsOnChildren',
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 37
        }
      ]
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
      errors: [
        {
          messageId: 'disallowArgumentUseSlotParams',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 45
        }
      ]
    },

    // Verify modifiers.
    {
      code: `
        <template>
          <MyComponent v-slot.foo="{data}">{{data}}</MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'disallowAnyModifier',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 34
        }
      ]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot.foo></template>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'disallowAnyModifier',
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 33
        }
      ]
    },
    {
      code: `
        <template>
          <MyComponent>
            <template v-slot:foo.bar></template>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'disallowAnyModifier',
          line: 4,
          column: 34,
          endLine: 4,
          endColumn: 37
        }
      ]
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
      errors: [
        {
          messageId: 'disallowAnyModifier',
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 33
        }
      ]
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
      errors: [
        {
          messageId: 'disallowAnyModifier',
          line: 4,
          column: 34,
          endLine: 4,
          endColumn: 37
        }
      ]
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
        {
          messageId: 'disallowAnyModifier',
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 37
        },
        {
          messageId: 'disallowAnyModifier',
          line: 6,
          column: 34,
          endLine: 6,
          endColumn: 37
        },
        {
          messageId: 'disallowAnyModifier',
          line: 7,
          column: 34,
          endLine: 7,
          endColumn: 41
        }
      ]
    },

    // Verify value.
    {
      code: `
        <template>
          <MyComponent v-slot>content</MyComponent>
        </template>
      `,
      errors: [
        {
          messageId: 'requireAttributeValue',
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 30
        }
      ]
    },
    // comment value
    {
      filename: 'comment-value1.vue',
      code: '<template><MyComponent v-slot="/**/" ><div /></MyComponent></template>',
      errors: [
        {
          messageId: 'requireAttributeValue',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'comment-value2.vue',
      code: '<template><MyComponent v-slot=/**/ ><div /></MyComponent></template>',
      errors: [
        {
          messageId: 'requireAttributeValue',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><MyComponent v-slot="" ><div /></MyComponent></template>',
      errors: [
        {
          messageId: 'requireAttributeValue',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 33
        }
      ]
    }
  ]
})
