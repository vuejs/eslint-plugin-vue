/**
 * @author Asish Kumar
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/block-attributes-order'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('block-attributes-order', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
<script setup lang="ts" generic="T extends string"></script>
<template lang="pug"></template>
<style scoped lang="scss"></style>
`
    },
    {
      filename: 'test.vue',
      code: `
<script setup vapor lang="ts"></script>
<script lang="ts" src="./script.ts"></script>
<template functional lang="html" src="./template.html"></template>
<style scoped module="classes" lang="scss" src="./style.scss"></style>
`
    },
    // attributes that match the same item may be in any order
    {
      filename: 'test.vue',
      code: `
<i18n locale="en" global lang="yaml" src="./en.yaml"></i18n>
<i18n global locale="en" lang="yaml"></i18n>
<docs foo bar></docs>
`
    },
    // single or no attributes
    {
      filename: 'test.vue',
      code: `
<script></script>
<template><div lang="en" id="app"></div></template>
<style lang="css"></style>
`
    },
    // only top-level blocks are checked
    {
      filename: 'test.vue',
      code: `
<template>
  <div lang="en" id="foo">
    <template lang="html" v-if="foo"></template>
  </div>
</template>
`
    },
    {
      filename: 'test.vue',
      code: `
<script lang="ts" setup></script>
<style lang="scss" scoped></style>
`,
      options: [
        [
          { element: 'script', order: ['lang', 'setup'] },
          { element: 'style', order: ['lang', ['scoped', 'module']] }
        ]
      ]
    },
    // blocks that match no option are not checked
    {
      filename: 'test.vue',
      code: `
<script lang="ts" setup></script>
<template lang="pug" functional></template>
<style lang="scss" scoped></style>
`,
      options: [[{ element: 'i18n', order: ['locale', 'lang'] }]]
    },
    // the first matching option is used
    {
      filename: 'test.vue',
      code: `
<script setup lang="ts"></script>
<script lang="ts" foo></script>
`,
      options: [
        [
          { element: 'script[setup]', order: ['setup', 'lang'] },
          { element: 'script', order: ['lang', 'foo'] },
          { element: '*', order: ['foo', 'lang'] }
        ]
      ]
    },
    // regular expressions and negative patterns
    {
      filename: 'test.vue',
      code: `
<i18n data-foo data-bar locale="en" foo lang="yaml"></i18n>
`,
      options: [
        [
          {
            element: 'i18n',
            order: [['/^data-/u', '!data-baz'], 'locale', '!/^lang$/', 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
<i18n data-foo data-baz></i18n>
<i18n data-foo data-bar></i18n>
`,
      options: [
        [
          {
            element: 'i18n',
            order: [['/^data-/u', '!data-baz'], 'data-baz']
          }
        ]
      ]
    },
    // the `g` flag doesn't make the matching stateful
    {
      filename: 'test.vue',
      code: `
<docs foo-a foo-b foo-c bar></docs>
`,
      options: [[{ element: 'docs', order: ['/^foo/g', 'bar'] }]]
    },
    // invalid EOF
    {
      filename: 'test.vue',
      code: `<template lang="html" functional><div a=">test</div></template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="html" functional><div><!--test</div></template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
<script lang="ts" setup></script>
`,
      output: `
<script setup lang="ts"></script>
`,
      errors: [
        {
          message: 'Attribute "setup" should go before "lang".',
          line: 2,
          column: 19,
          endLine: 2,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script setup generic="T" lang="ts"></script>
<template lang="pug" functional></template>
<style lang="scss" scoped></style>
<style src="./style.css" module></style>
`,
      output: `
<script setup lang="ts" generic="T"></script>
<template functional lang="pug"></template>
<style scoped lang="scss"></style>
<style module src="./style.css"></style>
`,
      errors: [
        {
          message: 'Attribute "lang" should go before "generic".',
          line: 2,
          column: 27,
          endLine: 2,
          endColumn: 36
        },
        {
          message: 'Attribute "functional" should go before "lang".',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 32
        },
        {
          message: 'Attribute "scoped" should go before "lang".',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 26
        },
        {
          message: 'Attribute "module" should go before "src".',
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 32
        }
      ]
    },
    // custom blocks
    {
      filename: 'test.vue',
      code: `
<i18n src="./en.yaml" lang="yaml" locale="en"></i18n>
`,
      output: `
<i18n lang="yaml" src="./en.yaml" locale="en"></i18n>
`,
      errors: [
        {
          message: 'Attribute "lang" should go before "src".',
          line: 2,
          column: 23,
          endLine: 2,
          endColumn: 34
        },
        {
          message: 'Attribute "locale" should go before "src".',
          line: 2,
          column: 35,
          endLine: 2,
          endColumn: 46
        }
      ]
    },
    // all attributes that are out of order are reported
    {
      filename: 'test.vue',
      code: `
<script lang="ts" foo bar setup></script>
`,
      output: `
<script foo lang="ts" bar setup></script>
`,
      errors: [
        {
          message: 'Attribute "foo" should go before "lang".',
          line: 2,
          column: 19,
          endLine: 2,
          endColumn: 22
        },
        {
          message: 'Attribute "bar" should go before "lang".',
          line: 2,
          column: 23,
          endLine: 2,
          endColumn: 26
        },
        {
          message: 'Attribute "setup" should go before "lang".',
          line: 2,
          column: 27,
          endLine: 2,
          endColumn: 32
        }
      ]
    },
    // multi-line attributes
    {
      filename: 'test.vue',
      code: `
<script
  lang="ts"
  setup
  generic="T extends Record<string, unknown>"
></script>
`,
      output: `
<script
  setup
  lang="ts"
  generic="T extends Record<string, unknown>"
></script>
`,
      errors: [
        {
          message: 'Attribute "setup" should go before "lang".',
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
<style module lang="scss"></style>
`,
      output: `
<script lang="ts" setup></script>
<style lang="scss" scoped></style>
<style lang="scss" module></style>
`,
      options: [
        [
          { element: 'script', order: ['lang', 'setup'] },
          { element: 'style', order: ['lang', ['scoped', 'module']] }
        ]
      ],
      errors: [
        {
          message: 'Attribute "lang" should go before "setup".',
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 24
        },
        {
          message: 'Attribute "lang" should go before "scoped".',
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 26
        },
        {
          message: 'Attribute "lang" should go before "module".',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    // the first matching option is used
    {
      filename: 'test.vue',
      code: `
<script lang="ts" setup></script>
<script foo lang="ts"></script>
<style lang="css" foo></style>
`,
      output: `
<script setup lang="ts"></script>
<script lang="ts" foo></script>
<style foo lang="css"></style>
`,
      options: [
        [
          { element: 'script[setup]', order: ['setup', 'lang'] },
          { element: 'script', order: ['lang', 'foo'] },
          { element: '*', order: ['foo', 'lang'] }
        ]
      ],
      errors: [
        {
          message: 'Attribute "setup" should go before "lang".',
          line: 2,
          column: 19,
          endLine: 2,
          endColumn: 24
        },
        {
          message: 'Attribute "lang" should go before "foo".',
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 22
        },
        {
          message: 'Attribute "foo" should go before "lang".',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    // attributes that match no item go after all others
    {
      filename: 'test.vue',
      code: `
<script foo setup lang="ts"></script>
`,
      output: `
<script setup foo lang="ts"></script>
`,
      options: [[{ element: 'script', order: ['setup', 'lang'] }]],
      errors: [
        {
          message: 'Attribute "setup" should go before "foo".',
          line: 2,
          column: 13,
          endLine: 2,
          endColumn: 18
        },
        {
          message: 'Attribute "lang" should go before "foo".',
          line: 2,
          column: 19,
          endLine: 2,
          endColumn: 28
        }
      ]
    },
    // regular expressions and negative patterns
    {
      filename: 'test.vue',
      code: `
<i18n lang="yaml" data-baz locale="en" data-foo></i18n>
`,
      output: `
<i18n data-baz lang="yaml" locale="en" data-foo></i18n>
`,
      options: [
        [
          {
            element: 'i18n',
            order: [['/^data-/u', '!data-baz'], 'locale', '!/^lang$/', 'lang']
          }
        ]
      ],
      errors: [
        {
          message: 'Attribute "data-baz" should go before "lang".',
          line: 2,
          column: 19,
          endLine: 2,
          endColumn: 27
        },
        {
          message: 'Attribute "locale" should go before "lang".',
          line: 2,
          column: 28,
          endLine: 2,
          endColumn: 39
        },
        {
          message: 'Attribute "data-foo" should go before "lang".',
          line: 2,
          column: 40,
          endLine: 2,
          endColumn: 48
        }
      ]
    }
  ]
})
