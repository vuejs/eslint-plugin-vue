/**
 * @fileoverview enforce valid `nextTick` function calls
 * @author Flo Edelmann
 * @copyright 2021 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-next-tick')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  }
})

tester.run('valid-next-tick', rule, {
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
          await nt();
          await Vue.nextTick();
          await this.$nextTick();

          nt().then(callback);
          Vue.nextTick().then(callback);
          this.$nextTick().then(callback);

          nt(callback);
          Vue.nextTick(callback);
          this.$nextTick(callback);
        }
      }</script>`
    },

    // https://github.com/vuejs/eslint-plugin-vue/pull/1404#discussion_r550937500
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          foo.then(nt);
          foo.then(Vue.nextTick);
          foo.then(this.$nextTick);

          foo.then(nt, catchHandler);
          foo.then(Vue.nextTick, catchHandler);
          foo.then(this.$nextTick, catchHandler);
        }
      }</script>`
    },

    // https://github.com/vuejs/eslint-plugin-vue/pull/1404#discussion_r550936410
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          let foo = nt;
          foo = Vue.nextTick;
          foo = this.$nextTick;
        }
      }</script>`
    },

    // https://github.com/vuejs/eslint-plugin-vue/pull/1404#discussion_r550936933
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          Promise.all([nt(), someOtherPromise]);
          Promise.all([Vue.nextTick(), someOtherPromise]);
          Promise.all([this.$nextTick(), someOtherPromise]);
        }
      }</script>`
    },

    // https://github.com/vuejs/eslint-plugin-vue/pull/1404#discussion_r551769969
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        created() {
          let queue = nt();
          queue = queue.then(nt);
          return nt();
        },
        mounted() {
          const queue = Vue.nextTick();
          return Vue.nextTick();
        },
        updated() {
          const queue = this.$nextTick();
          return this.$nextTick();
        }
      }</script>`
    },

    {
      filename: 'test.vue',
      code: `<script>;
      export default {
        methods: {
          fn1 () {
            return this.$nextTick()
          },
          fn2 () {
            return this.$nextTick()
              .then(() => this.$nextTick())
          },
        }
      }</script>`
    },

    // https://github.com/vuejs/eslint-plugin-vue/issues/1776
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          let foo = bar ? nt : undefined;
          foo = bar ? Vue.nextTick : undefined;
          foo = bar ? this.$nextTick : undefined;
        }
      }</script>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt();
          Vue.nextTick();
          this.$nextTick();
        }
      }</script>`,
      output: null,
      errors: [
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 4,
          column: 11,
          suggestions: [
            {
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt();
          Vue.nextTick();
          this.$nextTick();
        }
      }</script>`
            }
          ]
        },
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 5,
          column: 15,
          suggestions: [
            {
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt();
          await Vue.nextTick();
          this.$nextTick();
        }
      }</script>`
            }
          ]
        },
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 6,
          column: 16,
          suggestions: [
            {
              output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt();
          Vue.nextTick();
          await this.$nextTick();
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
        mounted() {
          nt;
          Vue.nextTick;
          this.$nextTick;

          nt.then(callback);
          Vue.nextTick.then(callback);
          this.$nextTick.then(callback);
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          nt();
          Vue.nextTick();
          this.$nextTick();

          nt().then(callback);
          Vue.nextTick().then(callback);
          this.$nextTick().then(callback);
        }
      }</script>`,
      errors: [
        {
          message: '`nextTick` is a function.',
          line: 4,
          column: 11
        },
        {
          message: '`nextTick` is a function.',
          line: 5,
          column: 15
        },
        {
          message: '`nextTick` is a function.',
          line: 6,
          column: 16
        },
        {
          message: '`nextTick` is a function.',
          line: 8,
          column: 11
        },
        {
          message: '`nextTick` is a function.',
          line: 9,
          column: 15
        },
        {
          message: '`nextTick` is a function.',
          line: 10,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt;
          await Vue.nextTick;
          return this.$nextTick;
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt();
          await Vue.nextTick();
          return this.$nextTick();
        }
      }</script>`,
      errors: [
        {
          message: '`nextTick` is a function.',
          line: 4,
          column: 17
        },
        {
          message: '`nextTick` is a function.',
          line: 5,
          column: 21
        },
        {
          message: '`nextTick` is a function.',
          line: 6,
          column: 23
        }
      ]
    },

    // https://github.com/vuejs/eslint-plugin-vue/pull/1404#discussion_r550936933
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          Promise.all([nt, someOtherPromise]);
          Promise.all([Vue.nextTick, someOtherPromise]);
          Promise.all([this.$nextTick, someOtherPromise]);
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          Promise.all([nt(), someOtherPromise]);
          Promise.all([Vue.nextTick(), someOtherPromise]);
          Promise.all([this.$nextTick(), someOtherPromise]);
        }
      }</script>`,
      errors: [
        {
          message: '`nextTick` is a function.',
          line: 4,
          column: 24
        },
        {
          message: '`nextTick` is a function.',
          line: 5,
          column: 28
        },
        {
          message: '`nextTick` is a function.',
          line: 6,
          column: 29
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
          nt(callback, anotherCallback);
          Vue.nextTick(callback, anotherCallback);
          this.$nextTick(callback, anotherCallback);
        }
      }</script>`,
      output: null,
      errors: [
        {
          message: '`nextTick` expects zero or one parameters.',
          line: 4,
          column: 11
        },
        {
          message: '`nextTick` expects zero or one parameters.',
          line: 5,
          column: 15
        },
        {
          message: '`nextTick` expects zero or one parameters.',
          line: 6,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          nt(callback).then(anotherCallback);
          Vue.nextTick(callback).then(anotherCallback);
          this.$nextTick(callback).then(anotherCallback);

          await nt(callback);
          await Vue.nextTick(callback);
          await this.$nextTick(callback);
        }
      }</script>`,
      output: null,
      errors: [
        {
          message:
            'Either await the Promise or pass a callback function to `nextTick`.',
          line: 4,
          column: 11
        },
        {
          message:
            'Either await the Promise or pass a callback function to `nextTick`.',
          line: 5,
          column: 15
        },
        {
          message:
            'Either await the Promise or pass a callback function to `nextTick`.',
          line: 6,
          column: 16
        },
        {
          message:
            'Either await the Promise or pass a callback function to `nextTick`.',
          line: 8,
          column: 17
        },
        {
          message:
            'Either await the Promise or pass a callback function to `nextTick`.',
          line: 9,
          column: 21
        },
        {
          message:
            'Either await the Promise or pass a callback function to `nextTick`.',
          line: 10,
          column: 22
        }
      ]
    }
  ]
})
