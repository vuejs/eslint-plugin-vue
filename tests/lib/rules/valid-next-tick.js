/**
 * @fileoverview enforce valid `nextTick` function calls
 * @author Flo Edelmann
 * @copyright 2021 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-next-tick')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

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
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<script>import { nextTick as nt } from 'vue';
      export default {
        mounted() {
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
          column: 11
        },
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 5,
          column: 15
        },
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
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
          nt();
          Vue.nextTick();
          this.$nextTick();
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt();
          await Vue.nextTick();
          await this.$nextTick();
        }
      }</script>`,
      errors: [
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 4,
          column: 11
        },
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 5,
          column: 15
        },
        {
          message:
            'Await the Promise returned by `nextTick` or pass a callback function.',
          line: 6,
          column: 16
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
          await this.$nextTick;
        }
      }</script>`,
      output: `<script>import { nextTick as nt } from 'vue';
      export default {
        async mounted() {
          await nt();
          await Vue.nextTick();
          await this.$nextTick();
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
          column: 22
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
