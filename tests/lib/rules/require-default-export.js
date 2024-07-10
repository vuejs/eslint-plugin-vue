/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-default-export')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-default-export', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>Without script</template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        import { ref } from 'vue';
        
        export default {}
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const foo = 'foo';
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      const component = {};

      export default component;
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {defineComponent} from 'vue';

      export default defineComponent({});
      </script>
      `
    },
    {
      filename: 'test.js',
      code: `
      const foo = 'foo';
      export const bar = 'bar';
      `
    },
    {
      filename: 'test.js',
      code: `
      import {defineComponent} from 'vue';
      defineComponent({});
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      const foo = 'foo';
      </script>
      `,
      errors: [
        {
          messageId: 'missing',
          line: 4,
          endLine: 4,
          column: 7,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export const foo = 'foo';
      </script>
      `,
      errors: [
        {
          messageId: 'missing',
          line: 4,
          endLine: 4,
          column: 7,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      const foo = 'foo';

      export { foo };
      </script>
      `,
      errors: [
        {
          messageId: 'missing',
          line: 6,
          endLine: 6,
          column: 7,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export const foo = 'foo';
      export const bar = 'bar';
      </script>
      `,
      errors: [
        {
          messageId: 'missing',
          line: 5,
          endLine: 5,
          column: 7,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent } from 'vue';

      export const component = defineComponent({});
      </script>
      `,
      errors: [
        {
          messageId: 'mustBeDefaultExport',
          line: 6,
          endLine: 6,
          column: 7,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import Vue from 'vue';

      const component = Vue.component('foo', {});
      </script>
      `,
      errors: [
        {
          messageId: 'mustBeDefaultExport',
          line: 6,
          endLine: 6,
          column: 7,
          endColumn: 16
        }
      ]
    }
  ]
})
