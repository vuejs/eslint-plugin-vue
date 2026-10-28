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
        },
        methods: {
          async a() {
            if (isOpen) {
              nt(() => foo());
            }
          },
          async b() {
            for (const item of items) {
              nt(() => foo(item));
            }
          },
          async c() {
            try {
              nt(() => foo());
            } finally {
              bar();
            }
          },
          async d(type) {
            switch (type) {
              case 'a':
                nt(() => foo());
            }
          },
          sync() {
            nt(() => foo());
          }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt().then(() => foo());
          bar();
        },
        methods: {
          async a() {
            if (isOpen) {
              nt().then(() => foo());
            }
          },
          async b() {
            for (const item of items) {
              nt().then(() => foo(item));
            }
          },
          async c() {
            try {
              nt().then(() => foo());
            } finally {
              bar();
            }
          },
          async d(type) {
            switch (type) {
              case 'a':
                nt().then(() => foo());
            }
          },
          sync() {
            nt().then(() => foo());
          }
        }
      }</script>`,
      errors: [
        {
          messageId: 'usePromise',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 13
        },
        {
          messageId: 'usePromise',
          line: 10,
          column: 15,
          endLine: 10,
          endColumn: 17
        },
        {
          messageId: 'usePromise',
          line: 15,
          column: 15,
          endLine: 15,
          endColumn: 17
        },
        {
          messageId: 'usePromise',
          line: 20,
          column: 15,
          endLine: 20,
          endColumn: 17
        },
        {
          messageId: 'usePromise',
          line: 28,
          column: 17,
          endLine: 28,
          endColumn: 19
        },
        {
          messageId: 'usePromise',
          line: 32,
          column: 13,
          endLine: 32,
          endColumn: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          async a() { nt(() => { return foo() }) },
          async b() { nt((value) => foo(value)) },
          async c() { nt(() => { const el = foo(); el.focus() }) },
          async d() { nt(() => { if (a) { var b = 1 } foo(b) }) },
          async e() { nt(() => { loop: for (;;) { break loop } }) },
          async f() { nt(async () => { await foo() }) },
          async g() { nt(function () { foo() }) },
          async h() { nt(callback) },
          async i() { nt(() => foo(), ctx) },
          async j() { nt(/* comment */ () => foo()) },
          async k() { nt(() => function () {}.call(this)) },
          async l() { const promise = nt(() => foo()) },
          async m() { if (a) nt(() => foo()) },
          async n() { await nt(() => foo()) },
          async o() { return nt(() => foo()) },
          async p() { const fn = () => { nt(() => foo()) } },
          async q() { class A { static { nt(() => foo()) } } }
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        methods: {
          async a() { nt().then(() => { return foo() }) },
          async b() { nt().then((value) => foo(value)) },
          async c() { nt().then(() => { const el = foo(); el.focus() }) },
          async d() { nt().then(() => { if (a) { var b = 1 } foo(b) }) },
          async e() { nt().then(() => { loop: for (;;) { break loop } }) },
          async f() { nt().then(async () => { await foo() }) },
          async g() { nt().then(function () { foo() }) },
          async h() { nt().then(callback) },
          async i() { nt().then(() => foo(), ctx) },
          async j() { nt().then(/* comment */ () => foo()) },
          async k() { nt().then(() => function () {}.call(this)) },
          async l() { const promise = nt().then(() => foo()) },
          async m() { if (a) nt().then(() => foo()) },
          async n() { await nt().then(() => foo()) },
          async o() { return nt().then(() => foo()) },
          async p() { const fn = () => { nt().then(() => foo()) } },
          async q() { class A { static { nt().then(() => foo()) } } }
        }
      }</script>`,
      languageOptions: { ecmaVersion: 2022 },
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
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 6,
          column: 23,
          endLine: 6,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 7,
          column: 23,
          endLine: 7,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 8,
          column: 23,
          endLine: 8,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 9,
          column: 23,
          endLine: 9,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 10,
          column: 23,
          endLine: 10,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 11,
          column: 23,
          endLine: 11,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 12,
          column: 23,
          endLine: 12,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 13,
          column: 23,
          endLine: 13,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 14,
          column: 23,
          endLine: 14,
          endColumn: 25
        },
        {
          messageId: 'usePromise',
          line: 15,
          column: 39,
          endLine: 15,
          endColumn: 41
        },
        {
          messageId: 'usePromise',
          line: 16,
          column: 30,
          endLine: 16,
          endColumn: 32
        },
        {
          messageId: 'usePromise',
          line: 17,
          column: 29,
          endLine: 17,
          endColumn: 31
        },
        {
          messageId: 'usePromise',
          line: 18,
          column: 30,
          endLine: 18,
          endColumn: 32
        },
        {
          messageId: 'usePromise',
          line: 19,
          column: 42,
          endLine: 19,
          endColumn: 44
        },
        {
          messageId: 'usePromise',
          line: 20,
          column: 42,
          endLine: 20,
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
