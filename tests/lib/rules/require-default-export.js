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
          line: 1
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
          line: 1
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
          line: 1
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
          line: 1
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
          messageId: 'missing',
          line: 1
        }
      ]
    }
  ]
})
