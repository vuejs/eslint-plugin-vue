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
          ignorePatterns: ['custom(\\-\\w+)+']
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
          ignorePatterns: ['custom(\\-\\w+)+']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom-component>
            Some text
          </custom-component>
        </template>
      `,
      options: [
        {
          ignorePatterns: ['custom(\\-\\w+)+']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom-component>
            Some text
          </custom-component>
        </template>
      `,
      options: [
        {
          ignorePatterns: ['Custom(\\w+)+']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom_component>
            Some text
          </custom_component>
        </template>
      `,
      options: [
        {
          ignorePatterns: ['Custom(\\w+)+']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <customComponent>
            Some text
          </customComponent>
        </template>
      `,
      options: [
        {
          ignorePatterns: ['Custom(\\w+)+']
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <customComponent>
            <warm-code>Text</warm-code>
            <InfoBtnPrimary value="text" />
          </customComponent>
        </template>
      `,
      options: [
        {
          ignorePatterns: ['Custom(\\w+)+', 'Warm(\\w+)+', 'InfoBtn(\\w+)+']
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
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="'div'" />
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component is="div" />
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component is="span">
            Text
          </component>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Component is="div" />
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Component is="span">
            Text
          </Component>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="name" />
        </template>
        <script>
        export default {
          data: () => ({ name: 'div' })
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component :is="name" />
        </template>
        <script>
        export default {
          data: () => ({ name: 'warm-button' }),
          components: { WarmButton }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <teleport />
          <suspense />
          <suspense>
            <div>Text</div>
          </suspense>
          <Teleport />
          <Suspense />
          <Suspense>
            <div>Text</div>
          </Suspense>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <transition />
          <transition-group />
          <keep-alive />
          <transition>
            <div>Text</div>
          </transition>
          <TransitionGroup />
          <KeepAlive />
          <Transition>
            <div>Text</div>
          </Transition>
          <Slot />
          <slot />
          <slot>
            foo
          </slot>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Custom-Component />
        </template>
        <script>
        export default {
          components: {
            'custom-component': InfoPrimaryWrapper
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component is />
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Component is />
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-is="'CustomComponent'" />
        </template>
        <script>
        export default {
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
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
        }
      ]
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
          ignorePatterns: ['custom(\\-\\w+)+']
        }
      ],
      errors: [
        {
          message:
            'The "WarmButton" component has been used but not registered.',
          line: 3
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
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
        }
      ]
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
          ignorePatterns: ['custom(\\-\\w+)+']
        }
      ],
      errors: [
        {
          message:
            'The "WarmButton" component has been used but not registered.',
          line: 3
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
            WarmButton
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
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
        <script>
        export default {
          components: {
            WarmButton
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
        }
      ]
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
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
        }
      ]
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
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
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
            'custom-component': InfoPrimaryWrapper
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'The "CustomComponent" component has been used but not registered.',
          line: 3
        }
      ]
    }
  ]
})
