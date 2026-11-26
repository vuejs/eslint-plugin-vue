/**
 * @fileoverview enforce Promise or callback style in `nextTick`
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/next-tick-style'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2017,
    sourceType: 'module'
  }
})

tester.run('next-tick-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          this.$nextTick().then(() => callback());
          Vue.nextTick().then(() => callback());
          nt().then(() => callback());

          await this.$nextTick(); callback();
          await Vue.nextTick(); callback();
          await nt(); callback();
        }
      }</script>`
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          this.$nextTick().then(() => callback());
          Vue.nextTick().then(() => callback());
          nt().then(() => callback());

          await this.$nextTick(); callback();
          await Vue.nextTick(); callback();
          await nt(); callback();
        }
      }</script>`,
      options: ['promise']
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          this.$nextTick(() => callback());
          Vue.nextTick(() => callback());
          nt(() => callback());

          this.$nextTick(callback);
          Vue.nextTick(callback);
          nt(callback);
        }
      }</script>`,
      options: ['callback']
    },

    // https://github.com/vuejs/eslint-plugin-vue/pull/1400#discussion_r550937977
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          foo.then(this.$nextTick);
          foo.then(Vue.nextTick);
          foo.then(nt);

          foo.then(nt, catchHandler);
          foo.then(Vue.nextTick, catchHandler);
          foo.then(this.$nextTick, catchHandler);
        }
      }</script>`,
      options: ['promise']
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          foo.then(this.$nextTick);
          foo.then(Vue.nextTick);
          foo.then(nt);

          foo.then(nt, catchHandler);
          foo.then(Vue.nextTick, catchHandler);
          foo.then(this.$nextTick, catchHandler);
        }
      }</script>`,
      options: ['callback']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          this.$nextTick(() => callback());
          Vue.nextTick(() => callback());
          nt(() => callback());

          this.$nextTick(callback);
          Vue.nextTick(callback);
          nt(callback);
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          this.$nextTick().then(() => callback());
          Vue.nextTick().then(() => callback());
          nt().then(() => callback());

          this.$nextTick().then(callback);
          Vue.nextTick().then(callback);
          nt().then(callback);
        }
      }</script>`,
      errors: [
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 25
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 23
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 13
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 8,
          column: 16,
          endLine: 8,
          endColumn: 25
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 9,
          column: 15,
          endLine: 9,
          endColumn: 23
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          this.$nextTick(() => callback());
          Vue.nextTick(() => callback());
          nt(() => callback());

          this.$nextTick(callback);
          Vue.nextTick(callback);
          nt(callback);
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          this.$nextTick().then(() => callback());
          Vue.nextTick().then(() => callback());
          nt().then(() => callback());

          this.$nextTick().then(callback);
          Vue.nextTick().then(callback);
          nt().then(callback);
        }
      }</script>`,
      options: ['promise'],
      errors: [
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 25
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 23
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 13
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 8,
          column: 16,
          endLine: 8,
          endColumn: 25
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 9,
          column: 15,
          endLine: 9,
          endColumn: 23
        },
        {
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.',
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          this.$nextTick().then(() => callback());
          Vue.nextTick().then(() => callback());
          nt().then(() => callback());

          await this.$nextTick(); callback();
          await Vue.nextTick(); callback();
          await nt(); callback();
        }
      }</script>`,
      output: null,
      options: ['callback'],
      errors: [
        {
          message:
            'Pass a callback function to `nextTick` instead of using the returned Promise.',
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 25
        },
        {
          message:
            'Pass a callback function to `nextTick` instead of using the returned Promise.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 23
        },
        {
          message:
            'Pass a callback function to `nextTick` instead of using the returned Promise.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 13
        },
        {
          message:
            'Pass a callback function to `nextTick` instead of using the returned Promise.',
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        },
        {
          message:
            'Pass a callback function to `nextTick` instead of using the returned Promise.',
          line: 9,
          column: 21,
          endLine: 9,
          endColumn: 29
        },
        {
          message:
            'Pass a callback function to `nextTick` instead of using the returned Promise.',
          line: 10,
          column: 17,
          endLine: 10,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          this.isOpen = true
          this.$nextTick(() => {
            this.$refs.input.focus()
            this.isReady = true
          })
        },
        methods: {
          async a() {
            Vue.nextTick(() => callback());
          },
          async b() {
            nt(() => {});
          }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          this.isOpen = true
          await this.$nextTick();
          this.$refs.input.focus()
          this.isReady = true
        },
        methods: {
          async a() {
            await Vue.nextTick(); callback();
          },
          async b() {
            await nt();
          }
        }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 12,
          column: 17,
          endLine: 12,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 15,
          column: 13,
          endLine: 15,
          endColumn: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>
      import { nextTick } from 'vue'
      export default {
        setup() {
          async function onOpen() {
            isOpen.value = true
            nextTick(() => {
              // focus the input
              input.value.focus()
              log(\`opened
                  at \${Date.now()}\`)
            })
          }
          const onClose = async () => {
            nextTick(() => ({ closed: true }))
          }
          nextTick(() => init())
        }
      }
      </script>`,
      output: `<script>
      import { nextTick } from 'vue'
      export default {
        setup() {
          async function onOpen() {
            isOpen.value = true
            await nextTick();
            // focus the input
            input.value.focus()
            log(\`opened
                  at \${Date.now()}\`)
          }
          const onClose = async () => {
            await nextTick(); ({ closed: true })
          }
          nextTick().then(() => init())
        }
      }
      </script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 21
        },
        {
          messageId: 'usePromise',
          line: 15,
          column: 13,
          endLine: 15,
          endColumn: 21
        },
        {
          messageId: 'usePromise',
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt(() => foo());
          bar();
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 13,
          suggestions: [
            {
              messageId: 'useAwait',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt(); foo();
          bar();
        }
      }</script>`
            },
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt().then(() => foo());
          bar();
        }
      }</script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          if (isOpen) {
            nt(() => foo());
          }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          if (isOpen) {
            await nt(); foo();
          }
        }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          async a() {
            if (isOpen) {
              open()
            } else {
              nt(() => {
                this.$refs.input.focus()
                this.isReady = true
              })
            }
          },
          async b() {
            if (a) {
              open()
            } else if (b) {
              nt(() => foo())
            }
          },
          async c() {
            if (isOpen) {
              {
                nt(() => foo())
              }
            }
          }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          async a() {
            if (isOpen) {
              open()
            } else {
              await nt();
              this.$refs.input.focus()
              this.isReady = true
            }
          },
          async b() {
            if (a) {
              open()
            } else if (b) {
              await nt(); foo()
            }
          },
          async c() {
            if (isOpen) {
              {
                await nt(); foo()
              }
            }
          }
        }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 17
        },
        {
          messageId: 'usePromise',
          line: 18,
          column: 15,
          endLine: 18,
          endColumn: 17
        },
        {
          messageId: 'usePromise',
          line: 24,
          column: 17,
          endLine: 24,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          if (isOpen) {
            nt(() => foo());
          }
          bar();
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 15,
          suggestions: [
            {
              messageId: 'useAwait',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          if (isOpen) {
            await nt(); foo();
          }
          bar();
        }
      }</script>`
            },
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          if (isOpen) {
            nt().then(() => foo());
          }
          bar();
        }
      }</script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          for (const item of items) {
            nt(() => foo(item));
          }
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 15,
          suggestions: [
            {
              messageId: 'useAwait',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          for (const item of items) {
            await nt(); foo(item);
          }
        }
      }</script>`
            },
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          for (const item of items) {
            nt().then(() => foo(item));
          }
        }
      }</script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          try {
            nt(() => foo());
          } finally {
            bar();
          }
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 15,
          suggestions: [
            {
              messageId: 'useAwait',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          try {
            await nt(); foo();
          } finally {
            bar();
          }
        }
      }</script>`
            },
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          try {
            nt().then(() => foo());
          } finally {
            bar();
          }
        }
      }</script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          try {
            nt(() => foo());
          } catch (error) {
            bar(error);
          }
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 15,
          suggestions: [
            {
              messageId: 'useAwait',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          try {
            await nt(); foo();
          } catch (error) {
            bar(error);
          }
        }
      }</script>`
            },
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          try {
            nt().then(() => foo());
          } catch (error) {
            bar(error);
          }
        }
      }</script>`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          switch (type) {
            case 'a':
              nt(() => foo());
          }
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 17,
          suggestions: [
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          switch (type) {
            case 'a':
              nt().then(() => foo());
          }
        }
      }</script>`
            }
          ]
        }
      ]
    },
    ...[
      ['nt(() => { return foo() })', 'nt().then(() => { return foo() })'],
      ['nt((value) => foo(value))', 'nt().then((value) => foo(value))'],
      [
        'nt(() => { const el = foo(); el.focus() })',
        'nt().then(() => { const el = foo(); el.focus() })'
      ],
      [
        'nt(() => { if (a) { var b = 1 } foo(b) })',
        'nt().then(() => { if (a) { var b = 1 } foo(b) })'
      ],
      [
        'nt(() => { loop: for (;;) { break loop } })',
        'nt().then(() => { loop: for (;;) { break loop } })'
      ],
      [
        'nt(async () => { await foo() })',
        'nt().then(async () => { await foo() })'
      ],
      ['nt(function () { foo() })', 'nt().then(function () { foo() })'],
      ['nt(callback)', 'nt().then(callback)'],
      ['nt(() => foo(), ctx)', 'nt().then(() => foo(), ctx)'],
      ['nt(/* comment */ () => foo())', 'nt().then(/* comment */ () => foo())'],
      [
        "nt(() => { 'use strict'; foo() })",
        "nt().then(() => { 'use strict'; foo() })"
      ],
      ['nt(() => { "use strict" })', 'nt().then(() => { "use strict" })'],
      [
        "nt(() => { 'use asm'; foo() })",
        "nt().then(() => { 'use asm'; foo() })"
      ],
      [
        'const promise = nt(() => foo())',
        'const promise = nt().then(() => foo())'
      ],
      ['if (a) nt(() => foo())', 'if (a) nt().then(() => foo())'],
      ['await nt(() => foo())', 'await nt().then(() => foo())'],
      ['return nt(() => foo())', 'return nt().then(() => foo())']
    ].map(([code, output]) => ({
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() { ${code} }
      }</script>`,
      output: null,
      languageOptions: { ecmaVersion: 2020 as const },
      errors: [
        {
          messageId: 'usePromise',
          line: 3,
          column: 27 + code.search(/\bnt\b|\$?nextTick/u),
          endLine: 3,
          endColumn: 27 + code.search(/(?<=\bnt|nextTick)\b/u),
          suggestions: [
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() { ${output} }
      }</script>`
            }
          ]
        }
      ]
    })),
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          sync() { nt(() => foo()) },
          async a() { const fn = () => { nt(() => foo()) } },
          async b() { class A { static { nt(() => foo()) } } },
          c() { nt(function () { this.foo(arguments) }) }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          sync() { nt().then(() => foo()) },
          async a() { const fn = () => { nt().then(() => foo()) } },
          async b() { class A { static { nt().then(() => foo()) } } },
          c() { nt().then(function () { this.foo(arguments) }) }
        }
      }</script>`,
      languageOptions: { ecmaVersion: 2022 },
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 22
        },
        {
          messageId: 'usePromise',
          line: 5,
          column: 42,
          endLine: 5,
          endColumn: 44
        },
        {
          messageId: 'usePromise',
          line: 6,
          column: 42,
          endLine: 6,
          endColumn: 44
        },
        {
          messageId: 'usePromise',
          line: 7,
          column: 17,
          endLine: 7,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt(() => {
            items.forEach((item) => {
              if (!item) return
              const el = item.el
              el.focus()
            })
          });
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt();
          items.forEach((item) => {
            if (!item) return
            const el = item.el
            el.focus()
          });
        }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 13
        }
      ]
    },
    ...[
      ['nt(() => async function () {})', 'await nt(); (async function () {})'],
      [
        'nt(() => /* c */ function () {})',
        'await nt(); (/* c */ function () {})'
      ],
      ['nt(() => /* c */ class {})', 'await nt(); (/* c */ class {})'],
      [
        'nt(() => function () {}.call(this))',
        'await nt(); (function () {}.call(this))'
      ],
      ['nt(() => class {}.name);', 'await nt(); (class {}.name);'],
      ['nt(() => async () => {})', 'await nt(); async () => {}'],
      ['nt(() => (function () {})())', 'await nt(); (function () {})()'],
      ['nt(() => ({}).a)', 'await nt(); ({}).a'],
      ['nt(() => async)', 'await nt(); async']
    ].map(([code, output]) => ({
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() { ${code} }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() { ${output} }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 29
        }
      ]
    })),
    ...[
      'nt?.(() => foo())',
      'this.$nextTick?.(() => foo())',
      'this?.$nextTick(() => foo())',
      'Vue?.nextTick(() => foo())',
      'this.$nextTick(function () { this.foo() })',
      'this.$nextTick(async function () { await foo() })',
      'Vue.nextTick(function () { foo(arguments) })',
      'Vue.nextTick(function () { this.foo() })'
    ].flatMap((code) =>
      ['mounted', 'async mounted'].map((method) => ({
        filename: 'test.vue',
        code: `<script>import { nextTick as nt } from 'vue';
      export default {
        ${method}() { ${code} }
      }</script>`,
        output: null,
        languageOptions: { ecmaVersion: 2020 as const },
        errors: [
          {
            messageId: 'usePromise',
            line: 3,
            column: 14 + method.length + code.search(/\bnt\b|\$?nextTick/u),
            endLine: 3,
            endColumn:
              14 + method.length + code.search(/(?<=\bnt|nextTick)\b/u),
            suggestions: []
          }
        ]
      }))
    ),
    ...[
      'Vue.nextTick(() => { foo() })',
      'Vue.nextTick(() => { { function f() {} } })',
      'Vue.nextTick(() => let[0])',
      "'use strict'; Vue.nextTick(() => { await(x) })",
      "'use strict'; Vue.nextTick(() => foo(await))",
      "'use strict'; Vue.nextTick(() => { x = await + 1 })"
    ].map((code) => ({
      filename: 'test.js',
      code: `new Vue({ async mounted() { ${code} } })`,
      output: null,
      languageOptions: { sourceType: 'script' as const },
      errors: [
        {
          messageId: 'usePromise',
          line: 1,
          column: 29 + code.indexOf('nextTick'),
          endLine: 1,
          endColumn: 37 + code.indexOf('nextTick'),
          suggestions: [
            {
              messageId: 'useThen',
              output: `new Vue({ async mounted() { ${code.replace('nextTick', 'nextTick().then')} } })`
            }
          ]
        }
      ]
    })),
    {
      filename: 'test.js',
      code: `'use strict'
      new Vue({
        async mounted() {
          Vue.nextTick(() => { foo() })
        }
      })`,
      output: `'use strict'
      new Vue({
        async mounted() {
          await Vue.nextTick();
          foo()
        }
      })`,
      languageOptions: { sourceType: 'script' },
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.js',
      code: 'new Vue({\n  async *g() {\n    Vue.nextTick(() => { yield(1) })\n  }\n})',
      output: null,
      languageOptions: {
        ecmaVersion: 2018 as const,
        sourceType: 'script' as const
      },
      errors: [
        {
          messageId: 'usePromise',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 17,
          suggestions: [
            {
              messageId: 'useThen',
              output:
                'new Vue({\n  async *g() {\n    Vue.nextTick().then(() => { yield(1) })\n  }\n})'
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: [
        "<script>import { nextTick as nt } from 'vue';",
        'export default {',
        '  methods: {',
        '    async a() {',
        '      nt(() => {',
        '        foo()',
        '      })',
        '    },',
        '    async b() { nt(() => {',
        '      foo() // c',
        '    }) }',
        '  }',
        '}</script>'
      ].join('\r\n'),
      output: [
        "<script>import { nextTick as nt } from 'vue';",
        'export default {',
        '  methods: {',
        '    async a() {',
        '      await nt();',
        '      foo()',
        '    },',
        '    async b() { await nt();',
        '    foo() // c',
        '     }',
        '  }',
        '}</script>'
      ].join('\r\n'),
      errors: [
        {
          messageId: 'usePromise',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 9
        },
        {
          messageId: 'usePromise',
          line: 9,
          column: 17,
          endLine: 9,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          async a() { nt(() => {
            foo() // c
          }) },
          async b() { nt(() => { // c
          }) }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          async a() { await nt();
          foo() // c
           },
          async b() { await nt();
          // c
           }
        }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 7,
          column: 23,
          endLine: 7,
          endColumn: 25
        }
      ]
    },
    ...[
      [
        `nt(() => {
            foo() // c
          }); bar()`,
        `await nt();
          foo(); // c
           bar()`
      ],
      [
        `nt(() => { foo() });
          [a, b].forEach(bar)`,
        `await nt();
          foo();
          [a, b].forEach(bar)`
      ],
      [
        'nt(() => { foo() }); (bar || baz)()',
        `await nt();
          foo(); (bar || baz)()`
      ],
      [
        'nt(() => { x = () => {} }); (bar || baz)()',
        `await nt();
          x = () => {}; (bar || baz)()`
      ],
      [
        'nt(() => { x = {} /* c */ }); (bar || baz)()',
        `await nt();
          x = {}; /* c */ (bar || baz)()`
      ],
      [
        `nt(() => { if (a) { foo() } });
          bar()`,
        `await nt();
          if (a) { foo() }
          bar()`
      ],
      [
        `nt(() => { foo(); });
          bar()`,
        `await nt();
          foo();
          bar()`
      ],
      [
        `nt(() => { foo() })
          bar()`,
        `await nt();
          foo()
          bar()`
      ]
    ].map(([code, output]) => ({
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          ${code}
        }
      }</script>`,
      output: null,
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 13,
          suggestions: [
            {
              messageId: 'useAwait',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          ${output}
        }
      }</script>`
            },
            {
              messageId: 'useThen',
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          ${code.replace('nt(', 'nt().then(')}
        }
      }</script>`
            }
          ]
        }
      ]
    }))
  ]
})
