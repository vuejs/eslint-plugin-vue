/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/v-on-handler-style')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('v-on-handler-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`,
      options: [['method', 'inline-function']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo()" />
      </template>`,
      options: [['inline']]
    },
    {
      filename: 'test.vue',
      code: '<template><button @[foo()]="bar" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button :click="foo()" /></template>'
    },
    // inline -> method
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo(123)" />
        <button @click="foo.bar()" />
        <button @click="foo?.()" />
        <button @click="foo();foo();" />
        <button @click="{}" />
      </template>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo() /* comment */" />
      </template>`,
      options: [['method'], { ignoreIncludesComment: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template><button @click="foo()" /></template>
      <script>
      export default {
        methods: {
          foo(a) {}
        }
      }
      </script>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="foo()" />
        <button @click="bar()" />
        <button @click="baz()" />
      </template>
      <script>
      export default {
        methods: {
          foo(a, b) {},
          bar(...a) {},
          baz(a = 42) {},
        }
      }
      </script>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="foo()" />
        <button @click="bar()" />
        <button @click="baz()" />
      </template>
      <script>
      export default {
        methods: {
          foo: (a, b) => {},
          bar: (...a) => {},
          baz: (a = 42) => {},
        }
      }
      </script>`,
      options: [['method']]
    },
    // inline-function -> method
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo() /* comment */" />
      </template>`,
      options: [['method'], { ignoreIncludesComment: true }]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => handler(foo)" />
      </template>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo?.()" />
      </template>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => count++" />
      </template>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => { count++ }" />
      </template>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a, b) => foo(b, a)" />
        <button @click="(a, b) => foo(...a, b)" />
        <button @click="(...a) => foo(a)" />
      </template>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="(a) => foo(a)" />
        <button @click="(a) => bar(a)" />
        <button @click="(a, b) => baz(a, b)" />
      </template>
      <script>
      export default {
        methods: {
          foo(a, b) {},
          bar(...a) {},
          baz(a = 42) {},
        }
      }
      </script>`,
      options: [['method']]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="(a) => foo(a)" />
        <button @click="(a) => bar(a)" />
        <button @click="(a, b) => baz(a, b)" />
      </template>
      <script>
      export default {
        methods: {
          foo: (a, b) => {},
          bar: (...a) => {},
          baz: (a = 42) => {},
        }
      }
      </script>`,
      options: [['method']]
    },
    // inline-function -> inline
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a, b) => foo(a, b)" />
      </template>`,
      options: [['inline']]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="() => foo()" />
      </template>`,
      options: [['method', 'inline-function']],
      output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`,
      errors: [
        {
          message:
            'Prefer method handler, or inline function over inline handler in v-on.',
          line: 3,
          column: 25,
          suggestions: [
            {
              desc: 'Use method handler instead of inline handler.',
              output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`
            },
            {
              desc: 'Use inline function instead of inline handler.',
              output: `<template>
        <button @click="foo" />
        <button @click="() => foo()" />
        <button @click="() => foo()" />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="() => foo()" />
      </template>`,
      output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`,
      errors: [
        {
          message:
            'Prefer method handler, or inline function over inline handler in v-on.',
          line: 3,
          column: 25,
          suggestions: [
            {
              desc: 'Use method handler instead of inline handler.',
              output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`
            },
            {
              desc: 'Use inline function instead of inline handler.',
              output: `<template>
        <button @click="foo" />
        <button @click="() => foo()" />
        <button @click="() => foo()" />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="() => foo()" />
      </template>`,
      output: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="foo()" />
      </template>`,
      options: [['inline']],
      errors: [
        {
          message: 'Method handlers are not allowed. Use inline handler.',
          line: 2,
          column: 24,
          suggestions: []
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="() => foo()" />
      </template>`,
      options: [['method']],
      output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="foo" />
      </template>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="() => foo()" />
      </template>`,
      options: [['inline-function']],
      output: `<template>
        <button @click="foo" />
        <button @click="() => foo()" />
        <button @click="() => foo()" />
      </template>`,
      errors: [
        {
          message: 'Method handlers are not allowed. Use inline function.',
          line: 2,
          column: 24,
          suggestions: []
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 25,
          suggestions: []
        }
      ]
    },
    // inline -> method
    {
      filename: 'test.vue',
      code: '<template><div @click="foo( )" /></template>',
      output: `<template><div @click="foo" /></template>`,
      options: [['method']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 1,
          column: 24,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo() /* comment */" />
      </template>`,
      options: [['method']],
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo(/**/)"/>
        <button @click="/* comment */foo()"/>
        <button @click=foo()/*comment*/ />
        <button @click="foo()// comment
        "/>
      </template>`,
      options: [['method']],
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 38,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 24,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="fn();" />
        <button @click="fn();;" />
        <button @click="{ fn(); }" />
        <button @click="{(fn());;;}" />
      </template>`,
      options: [['method']],
      output: `
      <template>
        <button @click="fn" />
        <button @click="fn" />
        <button @click="fn" />
        <button @click="fn" />
      </template>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 6,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=" beforeSpace()" />
        <div @click='afterSpace() ' />
      </template>`,
      options: [['method']],
      output: `
      <template>
        <div @click="beforeSpace" />
        <div @click='afterSpace' />
      </template>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 23,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 22,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click=" &#x66;oo ( ) " />
      </template>`,
      options: [['method']],
      output: `
      <template>
        <button @click="&#x66;oo" />
      </template>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 26,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template><button @click="foo()" /></template>
      <script>
      export default {
        methods: {
          foo() {}
        }
      }
      </script>`,
      options: [['method']],
      output: `
      <template><button @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo() {}
        }
      }
      </script>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 33,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template><button @click="foo()" /></template>
      <script>
      export default {
        methods: {
          foo: () => {}
        }
      }
      </script>`,
      options: [['method']],
      output: `
      <template><button @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo: () => {}
        }
      }
      </script>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 33,
          suggestions: []
        }
      ]
    },
    // inline -> inline-function
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo( )" />
        <button @click="count++" />
      </template>`,
      output: `<template>
        <button @click="() => foo( )" />
        <button @click="() => count++" />
      </template>`,
      options: [['inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo($event)" /></template>',
      output: null,
      options: [['inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 24,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click=foo() /></template>',
      output: null,
      options: [['inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 23,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button @click="{foo();foo();}" /></template>',
      output: '<template><button @click="() => {foo();foo();}" /></template>',
      options: [['inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 27,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button @click="foo();foo();" /></template>',
      output: '<template><button @click="() => {foo();foo();}" /></template>',
      options: [['inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 27,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button @click="foo();" /></template>',
      output: '<template><button @click="() => {foo();}" /></template>',
      options: [['inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 27,
          suggestions: []
        }
      ]
    },
    // method -> inline
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
      </template>`,
      options: [['inline']],
      output: null,
      errors: [
        {
          message: 'Method handlers are not allowed. Use inline handler.',
          line: 2,
          column: 24,
          suggestions: []
        }
      ]
    },
    // inline-function -> method
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo()" />
        <button @click="(a, b) => foo(a, b)" />
        <button @click="() => { foo() }" />
      </template>`,
      options: [['method']],
      output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="foo" />
      </template>`,
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo() /* comment */" />
      </template>`,
      options: [['method']],
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a, b) => foo(a, b)" />
      </template>
      <script>
      export default {
        methods: {
          foo(a, b) {}
        }
      }
      </script>`,
      options: [['method']],
      output: `<template>
        <button @click="foo" />
      </template>
      <script>
      export default {
        methods: {
          foo(a, b) {}
        }
      }
      </script>`,
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a, b) => foo(a, b)" />
      </template>
      <script>
      export default {
        methods: {
          foo
        }
      }
      </script>`,
      options: [['method']],
      output: `<template>
        <button @click="foo" />
      </template>
      <script>
      export default {
        methods: {
          foo
        }
      }
      </script>`,
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        }
      ]
    },
    // inline-function -> inline
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo(a, b)" />
        <button @click="() => count++" />
        <button @click="() => { count++; foo(); }" />
      </template>`,
      options: [['inline']],
      output: `<template>
        <button @click="foo(a, b)" />
        <button @click="count++" />
        <button @click=" count++; foo(); " />
      </template>`,
      errors: [
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 3,
          column: 25,
          suggestions: []
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 25,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a) => foo(a, b)" />
      </template>`,
      options: [['inline']],
      output: null,
      errors: [
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 2,
          column: 25,
          suggestions: []
        }
      ]
    },

    // option order
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo()" />
      </template>`,
      options: [['inline-function', 'method']],
      output: `<template>
        <button @click="() => foo()" />
      </template>`,
      errors: [
        {
          message:
            'Prefer inline function, or method handler over inline handler in v-on.',
          line: 2,
          column: 25,
          suggestions: [
            {
              desc: 'Use inline function instead of inline handler.',
              output: `<template>
        <button @click="() => foo()" />
      </template>`
            },
            {
              desc: 'Use method handler instead of inline handler.',
              output: `<template>
        <button @click="foo" />
      </template>`
            }
          ]
        }
      ]
    }
  ]
})
