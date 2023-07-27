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
        <template v-for="e in list">
          <button @click="() => foo(e)" />
        </template>
      </template>`,
      options: [['method', 'inline-function']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <template v-for="e in list">
          <button @click="() => foo(e)" />
        </template>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
        <template v-for="e in list">
          <button @click="foo(e)" />
        </template>
      </template>`,
      options: [['method', 'inline']]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo()" />
      </template>`,
      options: ['inline']
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo()" />
      </template>`,
      options: ['inline-function']
    },
    {
      filename: 'test.vue',
      code: '<template><button @[foo()]="bar" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button :click="foo()" /></template>'
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
      output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="foo" />
      </template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25
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
        <button @click="foo" />
      </template>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25
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
      options: ['inline'],
      errors: [
        {
          message: 'Prefer inline handler over method handler in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 25
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
        <button @click="() => foo()" />
        <button @click="() => foo()" />
      </template>`,
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over method handler in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 25
        }
      ]
    },
    // ['method', 'inline-function']
    {
      filename: 'test.vue',
      code: '<template><div @click="foo( )" /></template>',
      output: `<template><div @click="foo" /></template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 1,
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo() /* comment */" />
      </template>`,
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo() /* comment */" />
      </template>`,
      output: `<template>
        <button @click="() => foo() /* comment */" />
      </template>`,
      options: [['method', 'inline-function'], { ignoreIncludesComment: true }],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 2,
          column: 25
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 38
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 24
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25
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
      output: `
      <template>
        <button @click="fn" />
        <button @click="fn" />
        <button @click="fn" />
        <button @click="fn" />
      </template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 6,
          column: 25
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
      output: `
      <template>
        <div @click="beforeSpace" />
        <div @click='afterSpace' />
      </template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 23
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click=" &#x66;oo ( ) " />
      </template>`,
      output: `
      <template>
        <button @click="&#x66;oo" />
      </template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 26
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
      output: `
      <template><button @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo() {}
        }
      }
      </script>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 33
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
      output: `
      <template><button @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo: () => {}
        }
      }
      </script>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo(123)" />
        <button @click="foo.bar()" />
        <button @click="foo?.()" />
        <button @click="foo();foo();" />
        <button @click="{}" />
      </template>`,
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 25
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 3,
          column: 25
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 4,
          column: 25
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 5,
          column: 25
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 6,
          column: 25
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
          foo(a) {}
        }
      }
      </script>`,
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 33
        }
      ]
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25
        }
      ]
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <template v-for="e in list">
          <button @click="e()" />
        </template>
      </template>`,
      output: `<template>
        <template v-for="e in list">
          <button @click="e" />
        </template>
      </template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <template v-for="e in list">
          <button @click="handler(e)" />
          <button @click="handlers[e]()" />
          <button @click="handler(a(b), c(d), e + f)" />
          <button @click="e.foo()" />
        </template>
      </template>`,
      output: `<template>
        <template v-for="e in list">
          <button @click="() => handler(e)" />
          <button @click="() => handlers[e]()" />
          <button @click="() => handler(a(b), c(d), e + f)" />
          <button @click="() => e.foo()" />
        </template>
      </template>`,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 27
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 4,
          column: 27
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 5,
          column: 27
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 6,
          column: 27
        }
      ]
    },
    // 'inline-function'
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
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo($event)" /></template>',
      output: null,
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click=foo() /></template>',
      output: null,
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button @click="{foo();foo();}" /></template>',
      output: '<template><button @click="() => {foo();foo();}" /></template>',
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button @click="foo();foo();" /></template>',
      output: '<template><button @click="() => {foo();foo();}" /></template>',
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><button @click="foo();" /></template>',
      output: '<template><button @click="() => {foo();}" /></template>',
      options: ['inline-function'],
      errors: [
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 1,
          column: 27
        }
      ]
    },
    // 'inline' with method
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="foo" />
      </template>`,
      output: null,
      options: ['inline'],
      errors: [
        {
          message: 'Prefer inline handler over method handler in v-on.',
          line: 2,
          column: 25
        }
      ]
    },
    // ['method', 'inline']
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo()" />
        <button @click="(a, b) => foo(a, b)" />
        <button @click="() => { foo() }" />
      </template>`,
      output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="foo" />
      </template>`,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo() /* comment */" />
      </template>`,
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo() /* comment */" />
      </template>`,
      output: `<template>
        <button @click="foo() /* comment */" />
      </template>`,
      options: [['method', 'inline'], { ignoreIncludesComment: true }],
      errors: [
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 2,
          column: 25
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
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25
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
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => handler(foo)" />
      </template>`,
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo?.()" />
      </template>`,
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message:
            'Prefer method handler over inline function in v-on. Note that you may need to create a new method.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => count++" />
      </template>`,
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message:
            'Prefer method handler over inline function in v-on. Note that you may need to create a new method.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => { count++ }" />
      </template>`,
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message:
            'Prefer method handler over inline function in v-on. Note that you may need to create a new method.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a, b) => foo(b, a)" />
        <button @click="(a, b) => foo(...a, b)" />
        <button @click="(...a) => foo(a)" />
      </template>`,
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25
        }
      ]
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
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 25
        }
      ]
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
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <template v-for="e in list">
          <button @click="() => e()" />
          <button @click="(a) => e(a)" />
          <button @click="(a, b) => e(a, b)" />
        </template>
      </template>`,
      output: `<template>
        <template v-for="e in list">
          <button @click="e" />
          <button @click="e" />
          <button @click="e" />
        </template>
      </template>`,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 27
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 27
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <template v-for="e in list">
          <button @click="() => handler(e)" />
          <button @click="() => handlers[e]()" />
          <button @click="() => handler(a(b), c(d), e + f)" />
          <button @click="() => e.foo()" />
        </template>
      </template>`,
      output: `<template>
        <template v-for="e in list">
          <button @click="handler(e)" />
          <button @click="handlers[e]()" />
          <button @click="handler(a(b), c(d), e + f)" />
          <button @click="e.foo()" />
        </template>
      </template>`,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 3,
          column: 27
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 27
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 5,
          column: 27
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 6,
          column: 27
        }
      ]
    },
    // 'inline' with function
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="() => foo(a, b)" />
        <button @click="() => count++" />
        <button @click="() => { count++; foo(); }" />
      </template>`,
      output: `<template>
        <button @click="foo(a, b)" />
        <button @click="count++" />
        <button @click=" count++; foo(); " />
      </template>`,
      options: ['inline'],
      errors: [
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 2,
          column: 25
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 3,
          column: 25
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a) => foo(a, b)" />
      </template>`,
      output: null,
      options: ['inline'],
      errors: [
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 2,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <button @click="(a, b) => foo(a, b)" />
      </template>`,
      output: null,
      options: ['inline'],
      errors: [
        {
          message:
            'Prefer inline handler over inline function in v-on. Note that the custom event must be changed to a single payload.',
          line: 2,
          column: 25
        }
      ]
    }
  ]
})
