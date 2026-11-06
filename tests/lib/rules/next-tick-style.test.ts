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
        'nt(() => function () {}.call(this))',
        'nt().then(() => function () {}.call(this))'
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
      errors: [
        {
          messageId: 'usePromise',
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
          async b() { class A { static { nt(() => foo()) } } }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          sync() { nt().then(() => foo()) },
          async a() { const fn = () => { nt().then(() => foo()) } },
          async b() { class A { static { nt().then(() => foo()) } } }
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
          })
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
    }
  ]
})
