/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/v-on-handler-style'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="foo" />
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
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="foo" />
        <button @click="foo" />
        <button @click="() => foo()" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="foo" />
        <button @click="foo()" />
        <button @click="foo" />
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
      options: ['inline'],
      errors: [
        {
          message: 'Prefer inline handler over method handler in v-on.',
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 28
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 36
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
          column: 25,
          endLine: 2,
          endColumn: 28
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 30
        }
      ]
    },
    // ['method', 'inline-function']
    {
      filename: 'test.vue',
      code: '<template><div @click="foo( )" /></template>',
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template><div @click="foo" /></template>`
            }
          ]
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
          column: 25,
          endLine: 2,
          endColumn: 30
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
          column: 25,
          endLine: 2,
          endColumn: 30
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
          column: 25,
          endLine: 2,
          endColumn: 34
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 43
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 29
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 30
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="fn" />
        <button @click="fn();;" />
        <button @click="{ fn(); }" />
        <button @click="{(fn());;;}" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 31,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="fn();" />
        <button @click="fn" />
        <button @click="{ fn(); }" />
        <button @click="{(fn());;;}" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 34,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="fn();" />
        <button @click="fn();;" />
        <button @click="fn" />
        <button @click="{(fn());;;}" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="fn();" />
        <button @click="fn();;" />
        <button @click="{ fn(); }" />
        <button @click="fn" />
      </template>`
            }
          ]
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <div @click="beforeSpace" />
        <div @click='afterSpace() ' />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 34,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <div @click=" beforeSpace()" />
        <div @click='afterSpace' />
      </template>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click=" &#x66;oo ( ) " />
      </template>`,
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="&#x66;oo" />
      </template>`
            }
          ]
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
          column: 33,
          endLine: 2,
          endColumn: 38
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
          column: 33,
          endLine: 2,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="changeFunc()" />
        <button @click="() => changeFunc()" />
      </template>
      <script setup>
      import { changeFunc } from './utils'
      </script>`,
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="changeFunc" />
        <button @click="() => changeFunc()" />
      </template>
      <script setup>
      import { changeFunc } from './utils'
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 43,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="changeFunc()" />
        <button @click="changeFunc" />
      </template>
      <script setup>
      import { changeFunc } from './utils'
      </script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="toggle()" />
        <button @click="reset()" />
      </template>
      <script setup>
      const { toggle } = useStore()
      let reset = () => {}
      </script>`,
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="toggle" />
        <button @click="reset()" />
      </template>
      <script setup>
      const { toggle } = useStore()
      let reset = () => {}
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 32,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="toggle()" />
        <button @click="reset" />
      </template>
      <script setup>
      const { toggle } = useStore()
      let reset = () => {}
      </script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template><button @click="toggle()" /></template>
      <script>
      export default {
        setup() {
          return { toggle: (isOpen) => {} }
        }
      }
      </script>`,
      output: null,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 2,
          column: 33,
          endLine: 2,
          endColumn: 41,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template><button @click="toggle" /></template>
      <script>
      export default {
        setup() {
          return { toggle: (isOpen) => {} }
        }
      }
      </script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="toggle()" />
        <button @click="() => toggle()" />
        <button @click="(isOpen) => toggle(isOpen)" />
      </template>
      <script setup>
      function toggle(isOpen) {}
      </script>`,
      output: `
      <template>
        <button @click="toggle()" />
        <button @click="() => toggle()" />
        <button @click="toggle" />
      </template>
      <script setup>
      function toggle(isOpen) {}
      </script>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="toggle" />
        <button @click="() => toggle()" />
        <button @click="(isOpen) => toggle(isOpen)" />
      </template>
      <script setup>
      function toggle(isOpen) {}
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 39,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="toggle()" />
        <button @click="toggle" />
        <button @click="(isOpen) => toggle(isOpen)" />
      </template>
      <script setup>
      function toggle(isOpen) {}
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 51,
          suggestions: []
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="foo()" />
        <button @click="() => bar()" />
        <button @click="(a) => baz(a)" />
      </template>
      <script setup>
      function foo() {}
      const bar = () => {}
      const baz = function (a) {}
      </script>`,
      output: `
      <template>
        <button @click="foo" />
        <button @click="bar" />
        <button @click="baz" />
      </template>
      <script setup>
      function foo() {}
      const bar = () => {}
      const baz = function (a) {}
      </script>`,
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 30,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 36,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 38,
          suggestions: []
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
          column: 25,
          endLine: 2,
          endColumn: 33
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 34
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 32
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 37
        },
        {
          message:
            'Prefer method handler over inline handler in v-on. Note that you may need to create a new method.',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 27
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
          column: 33,
          endLine: 2,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template><button @click="foo" /></template>
      <script>
      export default {
        methods: {
          foo(a) {}
        }
      }
      </script>`
            }
          ]
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
          column: 25,
          endLine: 3,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo()" />
        <button @click="bar" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo()" />
        <button @click="bar()" />
        <button @click="baz" />
      </template>
      <script>
      export default {
        methods: {
          foo(a, b) {},
          bar(...a) {},
          baz(a = 42) {},
        }
      }
      </script>`
            }
          ]
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
          column: 25,
          endLine: 3,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo()" />
        <button @click="bar" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo()" />
        <button @click="bar()" />
        <button @click="baz" />
      </template>
      <script>
      export default {
        methods: {
          foo: (a, b) => {},
          bar: (...a) => {},
          baz: (a = 42) => {},
        }
      }
      </script>`
            }
          ]
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
      output: null,
      options: [['method', 'inline-function']],
      errors: [
        {
          message: 'Prefer method handler over inline handler in v-on.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <template v-for="e in list">
          <button @click="e" />
        </template>
      </template>`
            }
          ]
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
          column: 27,
          endLine: 3,
          endColumn: 37
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 40
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 53
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 6,
          column: 27,
          endLine: 6,
          endColumn: 34
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
          column: 25,
          endLine: 2,
          endColumn: 31
        },
        {
          message: 'Prefer inline function over inline handler in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 32
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
          column: 24,
          endLine: 1,
          endColumn: 35
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
          column: 23,
          endLine: 1,
          endColumn: 28
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
          column: 27,
          endLine: 1,
          endColumn: 41
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
          column: 27,
          endLine: 1,
          endColumn: 39
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
          column: 27,
          endLine: 1,
          endColumn: 33
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
          column: 25,
          endLine: 2,
          endColumn: 28
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
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="foo" />
        <button @click="(a, b) => foo(a, b)" />
        <button @click="() => { foo() }" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 44,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="() => foo()" />
        <button @click="foo" />
        <button @click="() => { foo() }" />
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 40,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="() => foo()" />
        <button @click="(a, b) => foo(a, b)" />
        <button @click="foo" />
      </template>`
            }
          ]
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
          column: 25,
          endLine: 2,
          endColumn: 36
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
          column: 25,
          endLine: 2,
          endColumn: 36
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
          column: 25,
          endLine: 2,
          endColumn: 44
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
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 44,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <button @click="foo" />
      </template>
      <script>
      export default {
        methods: {
          foo
        }
      }
      </script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
        <MyButton @click="(a) => fn1(a)" />
        <MyButton @click="(a, b) => fn2(a, b)" />
        <MyButton @click="(a) => fn2(a)" />
      </template>
      <script setup>
      function fn1(a) {}
      function fn2(a, b) {}
      </script>`,
      output: `<template>
        <MyButton @click="fn1" />
        <MyButton @click="fn2" />
        <MyButton @click="(a) => fn2(a)" />
      </template>
      <script setup>
      function fn1(a) {}
      function fn2(a, b) {}
      </script>`,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 2,
          column: 27,
          endLine: 2,
          endColumn: 40,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 46,
          suggestions: []
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 40,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <MyButton @click="(a) => fn1(a)" />
        <MyButton @click="(a, b) => fn2(a, b)" />
        <MyButton @click="fn2" />
      </template>
      <script setup>
      function fn1(a) {}
      function fn2(a, b) {}
      </script>`
            }
          ]
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
          column: 25,
          endLine: 2,
          endColumn: 43
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
          column: 25,
          endLine: 2,
          endColumn: 38
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
          column: 25,
          endLine: 2,
          endColumn: 38
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
          column: 25,
          endLine: 2,
          endColumn: 42
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
          column: 25,
          endLine: 2,
          endColumn: 44
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 47
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 41
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
          column: 25,
          endLine: 3,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="(a) => foo(a)" />
        <button @click="bar" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 44,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="(a) => foo(a)" />
        <button @click="(a) => bar(a)" />
        <button @click="baz" />
      </template>
      <script>
      export default {
        methods: {
          foo(a, b) {},
          bar(...a) {},
          baz(a = 42) {},
        }
      }
      </script>`
            }
          ]
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
          column: 25,
          endLine: 3,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="foo" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="(a) => foo(a)" />
        <button @click="bar" />
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
      </script>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 44,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `
      <template>
        <button @click="(a) => foo(a)" />
        <button @click="(a) => bar(a)" />
        <button @click="baz" />
      </template>
      <script>
      export default {
        methods: {
          foo: (a, b) => {},
          bar: (...a) => {},
          baz: (a = 42) => {},
        }
      }
      </script>`
            }
          ]
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
      output: null,
      options: [['method', 'inline']],
      errors: [
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <template v-for="e in list">
          <button @click="e" />
          <button @click="(a) => e(a)" />
          <button @click="(a, b) => e(a, b)" />
        </template>
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 38,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <template v-for="e in list">
          <button @click="() => e()" />
          <button @click="e" />
          <button @click="(a, b) => e(a, b)" />
        </template>
      </template>`
            }
          ]
        },
        {
          message: 'Prefer method handler over inline function in v-on.',
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 44,
          suggestions: [
            {
              messageId: 'replaceWithMethodHandler',
              output: `<template>
        <template v-for="e in list">
          <button @click="() => e()" />
          <button @click="(a) => e(a)" />
          <button @click="e" />
        </template>
      </template>`
            }
          ]
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
          column: 27,
          endLine: 3,
          endColumn: 43
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 46
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 59
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 6,
          column: 27,
          endLine: 6,
          endColumn: 40
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
          column: 25,
          endLine: 2,
          endColumn: 40
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 38
        },
        {
          message: 'Prefer inline handler over inline function in v-on.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 50
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
          column: 25,
          endLine: 2,
          endColumn: 41
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
          column: 25,
          endLine: 2,
          endColumn: 44
        }
      ]
    }
  ]
})
