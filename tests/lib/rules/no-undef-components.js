/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-undef-components')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-undef-components', rule, {
  valid: [
    // <script setup>
    {
      filename: 'test.vue',
      code: `
      <script setup>
        import Foo from './Foo.vue'
      </script>

      <template>
        <Foo />
        <Teleport />
        <template v-if="foo"></template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        import FooPascalCase from './component.vue'
        import BarPascalCase from './component.vue'
        import BazPascalCase from './component.vue'
      </script>

      <template>
        <FooPascalCase />
        <bar-pascal-case />
        <bazPascalCase />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import fooCamelCase from './component.vue'
      import barCamelCase from './component.vue'
      </script>

      <template>
        <fooCamelCase />
        <bar-camel-case />
      </template>
      `
    },
    // namespace
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import * as Form from './form-components'
      </script>

      <template>
        <Form.Input>
          <Form.Label>label</Form.Label>
        </Form.Input>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import Bar from './Bar.vue'
      </script>

      <template>
        <Foo />
      </template>
      `,
      options: [{ ignorePatterns: ['Foo'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import Bar from './Bar.vue'
      </script>

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

    // options API
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
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponent />
        </template>
        <script>
        export default {
          name: 'CustomComponent'
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom-component />
        </template>
        <script>
        export default {
          name: 'CustomComponent'
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom-component />
        </template>
        <script>
        export default {
          name: \`CustomComponent\`
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
          name: 'CustomComponent'
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component is="CustomComponent" />
        </template>
        <script>
        export default {
          name: 'CustomComponent'
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <component is="vue:CustomComponent" />
        </template>
        <script>
        export default {
          name: 'CustomComponent'
        }
        </script>
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
          name: 'CustomComponent'
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponentWithNamedSlots>
            <template #slotA>
              <div>Text</div>
            </template>
          </CustomComponentWithNamedSlots>
        </template>
        <script>
        export default {
          components: {
            CustomComponentWithNamedSlots
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <TheModal />
      </template>

      <script setup>
      import TheModal from 'foo'
      </script>`
    }
  ],
  invalid: [
    // <script setup>
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import Bar from './Bar.vue'
      </script>

      <template>
        <Foo />
      </template>
      `,
      errors: [
        {
          message: "The '<Foo>' component has been used, but not defined.",
          line: 7,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import PascalCase from './component.vue'
      </script>

      <template>
        <pascal_case />
      </template>
      `,
      errors: [
        {
          message:
            "The '<pascal_case>' component has been used, but not defined.",
          line: 7,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import * as Form from './form-components'
      </script>

      <template>
        <Foo.Input />
      </template>
      `,
      errors: [
        {
          message:
            "The '<Foo.Input>' component has been used, but not defined.",
          line: 7,
          column: 9
        }
      ]
    },

    // options API
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
            "The '<WarmButton>' component has been used, but not defined.",
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
            "The '<WarmButton>' component has been used, but not defined.",
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
            "The '<CustomComponent>' component has been used, but not defined.",
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
          name: CustomComponent
        }
        </script>
      `,
      errors: [
        {
          message:
            "The '<CustomComponent>' component has been used, but not defined.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <CustomComponentWithNamedSlots>
            <template #slotA>
              <div>Text</div>
            </template>
          </CustomComponentWithNamedSlots>
        </template>
      `,
      errors: [
        {
          message:
            "The '<CustomComponentWithNamedSlots>' component has been used, but not defined.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div is="vue:foo" />
        </template>
        <script>
        export default {
          components: {
            bar
          }
        }
        </script>
      `,
      errors: [
        {
          message: "The '<foo>' component has been used, but not defined.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-is="'foo'" />
        </template>
        <script>
        export default {
          components: {
            bar
          }
        }
        </script>
      `,
      errors: [
        {
          message: "The '<foo>' component has been used, but not defined.",
          line: 3
        }
      ]
    }
  ]
})
