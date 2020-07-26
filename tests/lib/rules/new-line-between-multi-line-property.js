/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/new-line-between-multi-line-property')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('new-line-between-multi-line-property', rule, {
  valid: [
    // test good example of proposal https://github.com/vuejs/eslint-plugin-vue/issues/391
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },

        computed: {
          formattedValue: function () {
            // ...
            // ...
            // ...
            // ...
          },

          inputClasses: function () {
            // ...
            // ...
            // ...
            // ...
          }
        },

        methods: {
          methodA: function () {
            // ...
            // ...
            // ...
          },

          methodB: function () {
            // ...
            // ...
            // ...
          }
        }
      }
      </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        }
      }
      </script>
      `,
      errors: [
        'Enforce new lines between multi-line properties in Vue components.'
      ]
    },
    // test bad example of proposal https://github.com/vuejs/eslint-plugin-vue/issues/391
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },
        computed: {
          formattedValue: function () {
            // ...
            // ...
            // ...
            // ...
          },

          inputClasses: function () {
            // ...
            // ...
            // ...
            // ...
          }
        },
        methods: {
          methodA: function () {
            // ...
            // ...
            // ...
          },

          methodB: function () {
            // ...
            // ...
            // ...
          }
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },

        computed: {
          formattedValue: function () {
            // ...
            // ...
            // ...
            // ...
          },

          inputClasses: function () {
            // ...
            // ...
            // ...
            // ...
          }
        },

        methods: {
          methodA: function () {
            // ...
            // ...
            // ...
          },

          methodB: function () {
            // ...
            // ...
            // ...
          }
        }
      }
      </script>
      `,
      errors: [
        'Enforce new lines between multi-line properties in Vue components.',
        'Enforce new lines between multi-line properties in Vue components.'
      ]
    },
    // test set insertLine to 2
    {
      filename: 'test.vue',
      options: [{ 'insert-line': 2 }],
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },


          focused: {
            type: Boolean,
            default: false
          },


          label: String,
          icon: String
        }
      }
      </script>
      `,
      errors: [
        'Enforce new lines between multi-line properties in Vue components.',
        'Enforce new lines between multi-line properties in Vue components.'
      ]
    },
    // test set insertLine and minLineOfMultilineProperty to 5
    {
      filename: 'test.vue',
      options: [{ 'insert-line': 2, 'min-line-of-multiline-property': 5 }],
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false,
            required: true
          },

          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false,
            required: true
          },


          label: String,
          icon: String
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        },
        staticMethodFn() {
          fn({
            a: {
              propA: this.propA,
            },
            b: null,
          });
        },
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        },
        staticMethodFn() {
          fn({
            a: {
              propA: this.propA,
            },
            b: null,
          });
        },
      }
      </script>
      `,
      errors: [
        'Enforce new lines between multi-line properties in Vue components.',
        'Enforce new lines between multi-line properties in Vue components.'
      ]
    }
  ]
})
