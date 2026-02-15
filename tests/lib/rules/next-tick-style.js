/**
 * @fileoverview enforce Promise or callback style in `nextTick`
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/next-tick-style')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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
        async mounted() {
          await this.$nextTick(); callback();
          await Vue.nextTick(); callback();
          await nt(); callback();
        }
      }</script>`,
      options: ['await']
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
      options: ['await']
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
          this.$nextTick(() => callback());
          Vue.nextTick(() => callback());
          nt(() => callback());

          this.$nextTick(callback);
          Vue.nextTick(callback);
          nt(callback);

          this.$nextTick().then(() => callback());
          Vue.nextTick().then(() => callback());
          nt().then(() => callback());
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await this.$nextTick();callback();
          await Vue.nextTick();callback();
          await nt();callback();

          await this.$nextTick();callback();
          await Vue.nextTick();callback();
          await nt();callback();

          await this.$nextTick();callback();
          await Vue.nextTick();callback();
          await nt();callback();
        }
      }</script>`,
      options: ['await'],
      errors: [
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 4,
          column: 16
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 5,
          column: 15
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 6,
          column: 11
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 8,
          column: 16
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 9,
          column: 15
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 10,
          column: 11
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 12,
          column: 16
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 13,
          column: 15
        },
        {
          message:
            'Use the await keyword with the Promise returned by `nextTick` instead of passing a callback function or using `.then()`.',
          line: 14,
          column: 11
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
    }
  ]
})
