/**
 * @fileoverview detect if there is a potential typo in your component property
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unknown-component-options')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
})
tester.run('no-unknown-component-options', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        dat: {},
        method: {}
      }
      </script>
      `
    },
    {

      filename: 'test.vue',
      code: `
      <script>
      export default {
      }
      </script>
      `.trim(),
      options: [{ presets: ['vue'] }]
    },
    // test if give preset and the potentialTypoList length is zero, just for 100% test cover
    {

      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {}
      }
      </script>
      `.trim(),
      options: [{ presets: ['vue'] }]
    }
    // give me some code that won't trigger a warning
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        dat: {},
        method: {}
      }
      </script>
      `.trim(),
      errors: [
        {
          message: "'dat' may be a typo, which is similar to option [data].",
          suggestions: [
            {
              desc: `Replace property 'dat' to 'data'`,
              output: `
      <script>
      export default {
        data: {},
        method: {}
      }
      </script>
              `.trim()
            }
          ]
        },
        {
          message: `'method' may be a typo, which is similar to option [methods].`,
          suggestions: [
            {
              desc: `Replace property 'method' to 'methods'`,
              output: `
      <script>
      export default {
        dat: {},
        methods: {}
      }
      </script>
              `.trim()
            }
          ]
        }
      ],
      options: [{ custom: ['data', 'methods'] }]
    },
    // test if user define custom rule is duplicate with presets
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        dat: {},
        method: {}
      }
      </script>
      `.trim(),
      errors: [
        {
          message: "'dat' may be a typo, which is similar to option [data].",
          suggestions: [
            {
              desc: `Replace property 'dat' to 'data'`,
              output: `
      <script>
      export default {
        data: {},
        method: {}
      }
      </script>
              `.trim()
            }
          ]
        },
        {
          message: `'method' may be a typo, which is similar to option [methods].`,
          suggestions: [
            {
              desc: `Replace property 'method' to 'methods'`,
              output: `
      <script>
      export default {
        dat: {},
        methods: {}
      }
      </script>
              `.trim()
            }
          ]
        }
      ],
      options: [{ custom: ['data', 'methods'], presets: ['all'] }]
    },
    // test if report correctly, only have preset option
    {

      filename: 'test.vue',
      code: `
      <script>
      export default {
        dat: {},
        method: {}
      }
      </script>
      `.trim(),
      errors: [
        {
          message: "'dat' may be a typo, which is similar to option [data].",
          suggestions: [
            {
              desc: `Replace property 'dat' to 'data'`,
              output: `
      <script>
      export default {
        data: {},
        method: {}
      }
      </script>
              `.trim()
            }
          ]
        },
        {
          message: `'method' may be a typo, which is similar to option [methods].`,
          suggestions: [
            {
              desc: `Replace property 'method' to 'methods'`,
              output: `
      <script>
      export default {
        dat: {},
        methods: {}
      }
      </script>
              `.trim()
            }
          ]
        }
      ],
      options: [{ presets: ['vue'] }]
    },
    // test multi suggestion
    {

      filename: 'test.vue',
      code: `
      <script>
      export default {
        method: {}
      }
      </script>
      `.trim(),
      errors: [
        {
          message: `'method' may be a typo, which is similar to option [methods,data].`,
          suggestions: [
            {
              desc: `Replace property 'method' to 'methods'`,
              output: `
      <script>
      export default {
        methods: {}
      }
      </script>
              `.trim()
            },
            {
              desc: `Replace property 'method' to 'data'`,
              output: `
      <script>
      export default {
        data: {}
      }
      </script>
              `.trim()
            }
          ]
        }
      ],
      options: [{ custom: ['data', 'methods'], threshold: 10 }]
    }
  ]
})
