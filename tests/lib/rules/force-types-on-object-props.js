/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/force-types-on-object-props')

const templateExport = (prop) => `
export default {
  props: ${prop}
}
`

const templateSetup = (prop) => `
<script setup lang="ts">
defineProps(
  ${prop}
)
</script>
`

const templateExtend = (prop) => `
export default Vue.extend({
  props: 
    ${prop}
});
`

const ruleTester = new RuleTester(/*{
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  }
}*/)

const expectedError = {
  message: 'Expected type annotation on object prop.'
}

ruleTester.run('force-types-on-object-props', rule, {
  valid: [
    // empty
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExport('{}')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExtend('{}')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateSetup('{}'),
      parser: require.resolve('vue-eslint-parser')
    },
    // primitive props
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExport('{ foo: String }')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExtend('{ foo: String }')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateSetup('{ foo: String }'),
      parser: require.resolve('vue-eslint-parser')
    },
    // union
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExport('{ foo: [Number, String, Boolean] }')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExtend('{ foo: [Number, String, Boolean] }')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateSetup('{ foo: [Number, String, Boolean] }'),
      parser: require.resolve('vue-eslint-parser')
    },
    // function
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExport('{ foo: someFunction() }')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExtend('{ foo: someFunction() }')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateSetup('{ foo: someFunction() }'),
      parser: require.resolve('vue-eslint-parser')
    },
    // typed object
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExport('{ foo: Object as PropType<User> }'),
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: templateExtend('{ foo: Object as PropType<User> }'),
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: templateSetup('{ foo: Object as PropType<User> }'),
      parser: require.resolve('vue-eslint-parser')
    },

    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: templateExport('{ foo: Object as () => User }'),
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: templateExtend('{ foo: Object as () => User }'),
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: templateSetup('{ foo: Object as () => User }'),
      parser: require.resolve('vue-eslint-parser')
    }

    // // `,
    //     // template('type: String'),
    //     // template('foo: String,'),
    //     // template('type: Number'),
    //     // template('type: Boolean'),
    //     // template('type: [String, Number, Boolean]'),
    //     // template('foo: someFunction(),'),
    //     // template('foo: { type: Object as () => User }'),
    //     // template('type: Object as Prop<{}>'),
    //     // template('foo: { type: Object as PropType<User> },'),
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: templateSetup('{ foo: Object }'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: templateExport('{ foo: Object }'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: templateExtend('{ foo: Object }'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: templateExtend('{ foo: { type: Object } }'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: templateExport('{ foo: { type: Object } }'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: templateSetup('{ foo: { type: Object } }'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    // any
    {
      filename: 'test.vue',
      code: templateSetup('{ foo: { type: Object as any} }'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default {
          props: {
            foo: { type: Object as any }
          }
        };
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default Vue.extend({
          props: {
            foo: { type: Object as any }
          }
        });
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    // unknown
    {
      filename: 'test.vue',
      code: templateSetup('{ foo: { type: Object as unknown} }'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default {
          props: {
            foo: { type: Object as unknown }
          }
        };
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
        export default Vue.extend({
          props: {
            foo: { type: Object as unknown }
          }
        });
        </script>
      `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      },
      parser: require.resolve('vue-eslint-parser'),
      errors: [expectedError]
    }
  ]
})
