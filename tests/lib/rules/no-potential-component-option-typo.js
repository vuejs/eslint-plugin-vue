/**
 * @fileoverview detect if there is a potential typo in your component property
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-potential-component-option-typo')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
})
tester.run('no-potential-component-option-typo', rule, {
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
      `,
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
      `,
      options: [{ presets: ['vue'] }]
    },
    // multi preset that won't report
    {

      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {},
        beforeRouteEnter() {}
      }
      </script>
      `,
      options: [{ presets: ['vue', 'vue-router'] }]
    },
    //  test custom option that is not available in the presets
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        custom: {},
        foo: {}
      }
      </script>
      `,
      options: [{ custom: ['custom', 'foo'] }]
    }
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
      </script>`,
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
      </script>`
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
      </script>`
            }
          ]
        }
      ],
      options: [{ custom: ['data', 'methods'] }]
    },
    // test if user define custom rule is duplicate with presets
    //  test custom option that is not available in the presets
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        dat: {},
        method: {},
        custo: {}
      }
      </script>`,
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
        method: {},
        custo: {}
      }
      </script>`
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
        methods: {},
        custo: {}
      }
      </script>`
            }
          ]
        },
        {
          message: `'custo' may be a typo, which is similar to option [custom].`,
          suggestions: [
            {
              desc: `Replace property 'custo' to 'custom'`,
              output: `
      <script>
      export default {
        dat: {},
        method: {},
        custom: {}
      }
      </script>`
            }
          ]
        }
      ],
      options: [{ custom: ['data', 'methods', 'custom', 'foo'], presets: ['all'] }]
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
      </script>`,
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
      </script>`
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
      </script>`
            }
          ]
        }
      ],
      options: [{ presets: ['vue'] }]
    },
    // multi preset report typo
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        dat: {},
        beforeRouteEntr,
        method: {}
      }
      </script>`,
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
        beforeRouteEntr,
        method: {}
      }
      </script>`
            }
          ]
        },
        {
          message: "'beforeRouteEntr' may be a typo, which is similar to option [beforeRouteEnter].",
          suggestions: [
            {
              desc: `Replace property 'beforeRouteEntr' to 'beforeRouteEnter'`,
              output: `
      <script>
      export default {
        dat: {},
        beforeRouteEnter,
        method: {}
      }
      </script>`
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
        beforeRouteEntr,
        methods: {}
      }
      </script>`
            }
          ]
        }
      ],
      options: [{ presets: ['vue', 'vue-router'] }]
    },
    // test multi suggestion
    {

      filename: 'test.vue',
      code: `
      <script>
      export default {
        method: {}
      }
      </script>`,
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
      </script>`
            },
            {
              desc: `Replace property 'method' to 'data'`,
              output: `
      <script>
      export default {
        data: {}
      }
      </script>`
            }
          ]
        }
      ],
      options: [{ custom: ['data', 'methods'], threshold: 10 }]
    }

  ]
})
