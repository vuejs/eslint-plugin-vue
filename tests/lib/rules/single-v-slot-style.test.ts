/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/single-v-slot-style'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('single-v-slot-style', rule, {
  valid: [
    // no slots at all
    {
      filename: 'test.vue',
      code: '<template><MyComponent /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent>content</MyComponent></template>'
    },
    // already in the default `without-wrapper` style
    {
      filename: 'test.vue',
      code: '<template><MyComponent #foo>content</MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-slot="{ bar }">{{ bar }}</MyComponent></template>'
    },
    // more than one slot
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template #foo>foo</template>
            <template #bar>bar</template>
          </MyComponent>
        </template>
      `
    },
    // the slot is not the only significant child
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template #foo>foo</template>
            <span>other</span>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template #foo>foo</template>
            other text
          </MyComponent>
        </template>
      `
    },
    // comments are significant by default
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <!-- keep me -->
            <template #foo>foo</template>
          </MyComponent>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <!-- keep me -->
            <template #foo>foo</template>
          </MyComponent>
        </template>
      `,
      options: [{ treatCommentsAsInsignificant: false }]
    },
    // the wrapper carries other attributes, so it cannot be removed
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo v-if="x">foo</template></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo v-for="x in xs" :key="x">foo</template></MyComponent></template>'
    },
    // `<template>` elements that are not slots
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template v-if="x">foo</template></MyComponent></template>'
    },
    // not a custom component
    {
      filename: 'test.vue',
      code: '<template><div><template #foo>foo</template></div></template>'
    },
    // dynamic slot names are not statically known
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #[dyn]>foo</template></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent #[dyn]>foo</MyComponent></template>',
      options: ['with-wrapper']
    },
    // modifiers are out of scope
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template v-slot:foo.mod>foo</template></MyComponent></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent #foo.mod>foo</MyComponent></template>',
      options: ['with-wrapper']
    },
    // mixed form, reported by `vue/valid-v-slot` instead
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-slot="{ a }"><template #foo>foo</template></MyComponent></template>',
      options: ['with-wrapper']
    },

    // `any`
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo>foo</template></MyComponent></template>',
      options: ['any']
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent #foo>foo</MyComponent></template>',
      options: ['any']
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #default>foo</template></MyComponent></template>',
      options: [{ namedSlotStyle: 'any' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo>foo</template></MyComponent></template>',
      options: [{ namedSlotStyle: 'any', defaultSlotStyle: 'without-wrapper' }]
    },

    // `with-wrapper`
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo>foo</template></MyComponent></template>',
      options: ['with-wrapper']
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #default="{ bar }">{{ bar }}</template></MyComponent></template>',
      options: ['with-wrapper']
    },
    // a component without an explicit `v-slot` is never required to add a wrapper
    {
      filename: 'test.vue',
      code: '<template><MyComponent>content</MyComponent></template>',
      options: ['with-wrapper']
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent #foo>foo</MyComponent></template>',
      options: [{ namedSlotStyle: 'without-wrapper' }]
    },
    // `defaultSlotStyle` inherits from `namedSlotStyle`
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #default>foo</template></MyComponent></template>',
      options: [{ namedSlotStyle: 'with-wrapper' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo>foo</template></MyComponent></template>',
      options: [{ namedSlotStyle: 'with-wrapper', defaultSlotStyle: 'any' }]
    }
  ],
  invalid: [
    // ---------------------------------------------------------------
    // `without-wrapper` (default) - named slots
    // ---------------------------------------------------------------
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo>content</template></MyComponent></template>',
      output: '<template><MyComponent #foo>content</MyComponent></template>',
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo="{ bar }">{{ bar }}</template></MyComponent></template>',
      output:
        '<template><MyComponent #foo="{ bar }">{{ bar }}</MyComponent></template>',
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      // the long form spelling is preserved
      filename: 'test.vue',
      code: '<template><MyComponent><template v-slot:foo>content</template></MyComponent></template>',
      output:
        '<template><MyComponent v-slot:foo>content</MyComponent></template>',
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      // other attributes on the component are kept
      filename: 'test.vue',
      code: '<template><MyComponent v-if="x" class="a"><template #foo>content</template></MyComponent></template>',
      output:
        '<template><MyComponent v-if="x" class="a" #foo>content</MyComponent></template>',
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 58
        }
      ]
    },

    // ---------------------------------------------------------------
    // `without-wrapper` (default) - default slot
    // ---------------------------------------------------------------
    {
      // no slot props: the directive is dropped entirely
      filename: 'test.vue',
      code: '<template><MyComponent><template #default>content</template></MyComponent></template>',
      output: '<template><MyComponent>content</MyComponent></template>',
      errors: [
        {
          message:
            "Redundant '<template>' wrapper for the only slot 'default'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent><template v-slot>content</template></MyComponent></template>',
      output: '<template><MyComponent>content</MyComponent></template>',
      errors: [
        {
          message:
            "Redundant '<template>' wrapper for the only slot 'default'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      // with slot props the directive has to stay
      filename: 'test.vue',
      code: '<template><MyComponent><template v-slot="{ bar }">{{ bar }}</template></MyComponent></template>',
      output:
        '<template><MyComponent v-slot="{ bar }">{{ bar }}</MyComponent></template>',
      errors: [
        {
          message:
            "Redundant '<template>' wrapper for the only slot 'default'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      // `#default` is normalized to `v-slot`, which is what `vue/valid-v-slot`
      // and `vue/v-slot-style` expect on a component
      filename: 'test.vue',
      code: '<template><MyComponent><template #default="{ bar }">{{ bar }}</template></MyComponent></template>',
      output:
        '<template><MyComponent v-slot="{ bar }">{{ bar }}</MyComponent></template>',
      errors: [
        {
          message:
            "Redundant '<template>' wrapper for the only slot 'default'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 53
        }
      ]
    },

    // ---------------------------------------------------------------
    // `without-wrapper` - indentation handling
    // ---------------------------------------------------------------
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template #foo>
              <span>content</span>
            </template>
          </MyComponent>
        </template>
      `,
      output: `
        <template>
          <MyComponent #foo>
            <span>content</span>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template #foo="{ bar }">
              <span>{{ bar }}</span>
              <span>{{ bar }}</span>
            </template>
          </MyComponent>
        </template>
      `,
      output: `
        <template>
          <MyComponent #foo="{ bar }">
            <span>{{ bar }}</span>
            <span>{{ bar }}</span>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 38
        }
      ]
    },
    {
      // multiline start tag on the wrapper
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template
              #foo="{ bar }"
            >
              <span>{{ bar }}</span>
            </template>
          </MyComponent>
        </template>
      `,
      output: `
        <template>
          <MyComponent #foo="{ bar }">
            <span>{{ bar }}</span>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 4,
          column: 13,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      // self-closing wrapper
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <template #foo />
          </MyComponent>
        </template>
      `,
      output: `
        <template>
          <MyComponent #foo>
          </MyComponent>
        </template>
      `,
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 30
        }
      ]
    },

    // ---------------------------------------------------------------
    // `treatCommentsAsInsignificant`
    // ---------------------------------------------------------------
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent>
            <!-- keep me -->
            <template #foo>content</template>
          </MyComponent>
        </template>
      `,
      output: `
        <template>
          <MyComponent #foo>
            <!-- keep me -->
            content
          </MyComponent>
        </template>
      `,
      options: [{ treatCommentsAsInsignificant: true }],
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 28
        }
      ]
    },
    {
      // a comment nested inside the slot content never blocks the report
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo><span><!-- inner --></span></template></MyComponent></template>',
      output:
        '<template><MyComponent #foo><span><!-- inner --></span></MyComponent></template>',
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 39
        }
      ]
    },

    // ---------------------------------------------------------------
    // `with-wrapper`
    // ---------------------------------------------------------------
    {
      filename: 'test.vue',
      code: '<template><MyComponent #foo>content</MyComponent></template>',
      output:
        '<template><MyComponent><template #foo>content</template></MyComponent></template>',
      options: ['with-wrapper'],
      errors: [
        {
          message:
            "Expected the only slot 'foo' to use a '<template>' wrapper.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent #foo="{ bar }">{{ bar }}</MyComponent></template>',
      output:
        '<template><MyComponent><template #foo="{ bar }">{{ bar }}</template></MyComponent></template>',
      options: [{ namedSlotStyle: 'with-wrapper' }],
      errors: [
        {
          message:
            "Expected the only slot 'foo' to use a '<template>' wrapper.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      // `v-slot` is normalized to the `#default` shorthand on the wrapper
      filename: 'test.vue',
      code: '<template><MyComponent v-slot="{ bar }">{{ bar }}</MyComponent></template>',
      output:
        '<template><MyComponent><template #default="{ bar }">{{ bar }}</template></MyComponent></template>',
      options: ['with-wrapper'],
      errors: [
        {
          message:
            "Expected the only slot 'default' to use a '<template>' wrapper.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      // other attributes on the component are kept
      filename: 'test.vue',
      code: '<template><MyComponent class="a" #foo v-if="x">content</MyComponent></template>',
      output:
        '<template><MyComponent class="a" v-if="x"><template #foo>content</template></MyComponent></template>',
      options: ['with-wrapper'],
      errors: [
        {
          message:
            "Expected the only slot 'foo' to use a '<template>' wrapper.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent #foo="{ bar }">
            <span>{{ bar }}</span>
          </MyComponent>
        </template>
      `,
      output: `
        <template>
          <MyComponent>
            <template #foo="{ bar }">
              <span>{{ bar }}</span>
            </template>
          </MyComponent>
        </template>
      `,
      options: ['with-wrapper'],
      errors: [
        {
          message:
            "Expected the only slot 'foo' to use a '<template>' wrapper.",
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 38
        }
      ]
    },
    {
      // a self-closing component cannot be restructured safely
      filename: 'test.vue',
      code: '<template><MyComponent #foo /></template>',
      output: null,
      options: ['with-wrapper'],
      errors: [
        {
          message:
            "Expected the only slot 'foo' to use a '<template>' wrapper.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 28
        }
      ]
    },

    // ---------------------------------------------------------------
    // option combinations
    // ---------------------------------------------------------------
    {
      // `defaultSlotStyle` overrides the inherited `namedSlotStyle`
      filename: 'test.vue',
      code: '<template><MyComponent><template #default>content</template></MyComponent></template>',
      output: '<template><MyComponent>content</MyComponent></template>',
      options: [{ namedSlotStyle: 'any', defaultSlotStyle: 'without-wrapper' }],
      errors: [
        {
          message:
            "Redundant '<template>' wrapper for the only slot 'default'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-slot="{ bar }">{{ bar }}</MyComponent></template>',
      output:
        '<template><MyComponent><template #default="{ bar }">{{ bar }}</template></MyComponent></template>',
      options: [{ namedSlotStyle: 'any', defaultSlotStyle: 'with-wrapper' }],
      errors: [
        {
          message:
            "Expected the only slot 'default' to use a '<template>' wrapper.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      // `defaultSlotStyle` inherits `namedSlotStyle` when it is not set
      filename: 'test.vue',
      code: '<template><MyComponent><template #default="{ bar }">{{ bar }}</template></MyComponent></template>',
      output:
        '<template><MyComponent v-slot="{ bar }">{{ bar }}</MyComponent></template>',
      options: [{ namedSlotStyle: 'without-wrapper' }],
      errors: [
        {
          message:
            "Redundant '<template>' wrapper for the only slot 'default'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 53
        }
      ]
    },
    {
      // string shorthand
      filename: 'test.vue',
      code: '<template><MyComponent><template #foo>content</template></MyComponent></template>',
      output: '<template><MyComponent #foo>content</MyComponent></template>',
      options: ['without-wrapper'],
      errors: [
        {
          message: "Redundant '<template>' wrapper for the only slot 'foo'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
})
