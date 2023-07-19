/**
 * @author Niklas Higi
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/v-on-function-call')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('v-on-function-call', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo(123)"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo(123)"></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo.bar()"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo.bar()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @[foo()]="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @[foo]="bar()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="()=>foo.bar()"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="()=>foo.bar()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="
          fn()
          fn()
        "></div>
      </template>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="{}"></div>
      </template>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="{return}"></div>
      </template>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="fn() /* comment */"></div>
      </template>`,
      options: ['never', { ignoreIncludesComment: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo?.()"></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template><div @click="foo()" /></template>
      <script>
      export default {
        methods: {
          foo(a) {}
        }
      }
      </script>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="foo()" />
        <div @click="bar()" />
        <div @click="baz()" />
      </template>
      <script>
      export default {
        methods: {
          foo(a,b) {},
          bar(...a) {},
          baz(a = 42) {},
        }
      }
      </script>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="foo()" />
        <div @click="bar()" />
        <div @click="baz()" />
      </template>
      <script>
      export default {
        methods: {
          foo: (a,b) => {},
          bar: (...a) => {},
          baz: (a = 42) => {},
        }
      }
      </script>`,
      options: ['never']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>',
      output: null,
      options: ['always'],
      errors: [
        "Method calls inside of 'v-on' directives must have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo()"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo( )"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo(/**/)"></div></template>',
      output: null,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="/*comment*/fn()"></div>
        <div @click="fn()/*comment*/"></div>
        <div @click=fn()/*comment*/></div>
        <div @click="fn()// comment
          "></div>
      </template>`,
      output: null,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="fn();"></div>
      </template>`,
      output: `
      <template>
        <div @click="fn"></div>
      </template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=fn();></div>
      </template>`,
      output: `
      <template>
        <div @click=fn></div>
      </template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=" beforeSpace()"></div>
        <div @click='afterSpace() '></div>
      </template>`,
      output: `
      <template>
        <div @click="beforeSpace"></div>
        <div @click='afterSpace'></div>
      </template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=" &#x66;oo ( ) "></div>
      </template>`,
      output: `
      <template>
        <div @click="&#x66;oo"></div>
      </template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="{(fn());;;}"></div>
      </template>`,
      output: `
      <template>
        <div @click="fn"></div>
      </template>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: '<template>\r\n<div\r\n@click="foo()" /></template>',
      output: '<template>\r\n<div\r\n@click="foo" /></template>',
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template><div @click="foo()" /></template>
      <script>
      export default {
        methods: {
          foo() {}
        }
      }
      </script>`,
      output: `
      <template><div @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo() {}
        }
      }
      </script>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template><div @click="foo()" /></template>
      <script>
      export default {
        methods: {
          foo: () => {}
        }
      }
      </script>`,
      output: `
      <template><div @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo: () => {}
        }
      }
      </script>`,
      options: ['never'],
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ]
    }
  ]
})
