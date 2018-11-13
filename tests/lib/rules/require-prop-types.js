/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-prop-types')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('require-prop-types', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo,
          props: {
            ...test(),
            foo: String
          }
        }
      `,
      parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: [String, Number]
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: String
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              ['type']: String
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              validator: v => v
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              ['validator']: v => v
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: externalProps
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: []
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {}
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {
              type: String
            } as PropOptions<string>
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: 'typescript-eslint-parser'
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            foo: {
              type: String
            } as PropOptions<string>
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: 'typescript-eslint-parser'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo', bar, \`baz\`, foo()]
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 3
      }, {
        message: 'Prop "bar" should define at least its type.',
        line: 3
      }, {
        message: 'Prop "baz" should define at least its type.',
        line: 3
      }, {
        message: 'Prop "Unknown prop" should define at least its type.',
        line: 3
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          props: ['foo', bar, \`baz\`, foo()]
        })
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 3
      }, {
        message: 'Prop "bar" should define at least its type.',
        line: 3
      }, {
        message: 'Prop "baz" should define at least its type.',
        line: 3
      }, {
        message: 'Prop "Unknown prop" should define at least its type.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: []
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo() {}
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            foo: {} as PropOptions<string>
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: 'typescript-eslint-parser',
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {} as PropOptions<string>
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: 'typescript-eslint-parser',
      errors: [{
        message: 'Prop "foo" should define at least its type.',
        line: 4
      }]
    }
  ]
})
