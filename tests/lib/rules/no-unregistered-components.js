/**
 * @fileoverview Report used components that are not registered
 * @author Jesús Ángel González Novez
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unregistered-components')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

tester.run('no-unregistered-components', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>Lorem ipsum</div>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent />
        </template>
      `,
      options: [
        {
          ignorePatterns: [
            /custom(\-\w+)+/
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent>
            Some text
          </CustomComponent>
        </template>
      `,
      options: [
        {
          ignorePatterns: [
            /custom(\-\w+)+/
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent />
        </template>
        <script>
        export default {
          components: {
            CustomComponent
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent>
            Some text
          </CustomComponent>
        </template>
        <script>
        export default {
          components: {
            CustomComponent
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="'CustomComponent'" />
        </template>
        <script>
        export default {
          components: {
            CustomComponent
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="'CustomComponent'">
            Some text
          </component>
        </template>
        <script>
        export default {
          components: {
            CustomComponent
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component v-if="showComponent" :is="'CustomComponent'" />
        </template>
        <script>
        export default {
          data: () => ({
            showComponent: true
          }),
          components: {
            CustomComponent
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component v-if="showComponent" :is="'CustomComponent'" />
        </template>
        <script>
        export default {
          data: () => ({
            showComponent: false
          }),
          components: {
            CustomComponent
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
        <template>
          <CustomComponent />
        </template>
      `,
      errors: [{
        message: 'The "CustomComponent" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <WarmButton />
        </template>
      `,
      options: [
        {
          ignorePatterns: [
            /custom(\-\w+)+/
          ]
        }
      ],
      errors: [{
        message: 'The "WarmButton" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent>
            Some text
          </CustomComponent>
        </template>
      `,
      errors: [{
        message: 'The "CustomComponent" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <WarmButton>
            Some text
          </WarmButton>
        </template>
      `,
      options: [
        {
          ignorePatterns: [
            /custom(\-\w+)+/
          ]
        }
      ],
      errors: [{
        message: 'The "WarmButton" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent />
        </template>
        <script>
        export default {
          components: {
            WarmButton
          }
        }
        </script>
      `,
      errors: [{
        message: 'The "CustomComponent" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent>
            Some text
          </CustomComponent>
        </template>
        <script>
        export default {
          components: {
            WarmButton
          }
        }
        </script>
      `,
      errors: [{
        message: 'The "CustomComponent" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="'CustomComponent'" />
        </template>
        <script>
        export default {
          components: {
            WarmButton
          }
        }
        </script>
      `,
      errors: [{
        message: 'The "CustomComponent" component has been used but not registered.',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="'CustomComponent'">
            Some text
          </component>
        </template>
        <script>
        export default {
          components: {
            WarmButton
          }
        }
        </script>
      `,
      errors: [{
        message: 'The "CustomComponent" component has been used but not registered.',
        line: 3
      }]
    }
  ]
})
