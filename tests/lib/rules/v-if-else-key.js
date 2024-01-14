/**
 * @author Felipe Melendez
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/v-if-else-key')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('v-if-else-key', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <CustomComponent v-if="some-condition" key="key1" />
            <CustomComponent v-else key="key2" />
          </div>
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
    <div>
      <CustomComponent v-if="some-condition" />
      <CustomComponent />
    </div>
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
          <div>
            <div v-if="some-condition" >
              <CustomComponent />
            </div>
            <CustomComponent v-else />
          </div>
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
          <div>
            <slot v-if="some-condition" />
            <slot v-else />
          </div>
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
          <div>
            <div v-if="someCondition" />
            <div v-else-if="otherCondition" />
            <div v-else />
          </div>
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
          <div>
            <div v-if="foo" />
            <span v-else />
          </div>
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
          <div>
            <OuterComponent v-if="showOuterComponent">
              <InnerComponent v-if="showInnerComponent1" />
              <InnerComponent v-else />
            </OuterComponent>
            <OuterComponent v-else>
              <InnerComponent :key="key1" />
              <InnerComponent :key="key2" />
            </OuterComponent>
          </div>
        </template>
        <script>
        export default {
          components: {
            OuterComponent,
            InnerComponent
          }
        }
        </script>
        `,
      output: `
        <template>
          <div>
            <OuterComponent key="outer-component-1" v-if="showOuterComponent">
              <InnerComponent key="inner-component-1" v-if="showInnerComponent1" />
              <InnerComponent key="inner-component-2" v-else />
            </OuterComponent>
            <OuterComponent key="outer-component-2" v-else>
              <InnerComponent :key="key1" />
              <InnerComponent :key="key2" />
            </OuterComponent>
          </div>
        </template>
        <script>
        export default {
          components: {
            OuterComponent,
            InnerComponent
          }
        }
        </script>
        `,
      errors: [
        {
          message:
            "Conditionally rendered repeated component 'OuterComponent' expected to have a 'key' attribute.",
          line: 4
        },
        {
          message:
            "Conditionally rendered repeated component 'InnerComponent' expected to have a 'key' attribute.",
          line: 5
        },
        {
          message:
            "Conditionally rendered repeated component 'InnerComponent' expected to have a 'key' attribute.",
          line: 6
        },
        {
          message:
            "Conditionally rendered repeated component 'OuterComponent' expected to have a 'key' attribute.",
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <OuterComponent v-if="showOuterComponent">
              <InnerComponent v-if="showInnerComponent1">
                <DifferentScopeComponent />
              </InnerComponent>
              <InnerComponent v-else />
            </OuterComponent>
            <OuterComponent v-else>
              <InnerComponent />
              <InnerComponent />
            </OuterComponent>
            <DifferentScopeComponent />
          </div>
        </template>
        <script>
        export default {
          components: {
            OuterComponent,
            InnerComponent
          }
        }
        </script>
        `,
      output: `
        <template>
          <div>
            <OuterComponent key="outer-component-1" v-if="showOuterComponent">
              <InnerComponent key="inner-component-1" v-if="showInnerComponent1">
                <DifferentScopeComponent />
              </InnerComponent>
              <InnerComponent key="inner-component-2" v-else />
            </OuterComponent>
            <OuterComponent key="outer-component-2" v-else>
              <InnerComponent />
              <InnerComponent />
            </OuterComponent>
            <DifferentScopeComponent />
          </div>
        </template>
        <script>
        export default {
          components: {
            OuterComponent,
            InnerComponent
          }
        }
        </script>
        `,
      errors: [
        {
          message:
            "Conditionally rendered repeated component 'OuterComponent' expected to have a 'key' attribute.",
          line: 4
        },
        {
          message:
            "Conditionally rendered repeated component 'InnerComponent' expected to have a 'key' attribute.",
          line: 5
        },
        {
          message:
            "Conditionally rendered repeated component 'InnerComponent' expected to have a 'key' attribute.",
          line: 8
        },
        {
          message:
            "Conditionally rendered repeated component 'OuterComponent' expected to have a 'key' attribute.",
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <OuterComponent v-if="showOuterComponent">
              <InnerComponent v-if="showInnerComponent1" />
              <InnerComponent v-else />
            </OuterComponent>
            <InnerComponent v-else />
          </div>
        </template>
        <script>
        export default {
          components: {
            OuterComponent,
            InnerComponent
          }
        }
        </script>
        `,
      output: `
        <template>
          <div>
            <OuterComponent v-if="showOuterComponent">
              <InnerComponent key="inner-component-1" v-if="showInnerComponent1" />
              <InnerComponent key="inner-component-2" v-else />
            </OuterComponent>
            <InnerComponent v-else />
          </div>
        </template>
        <script>
        export default {
          components: {
            OuterComponent,
            InnerComponent
          }
        }
        </script>
        `,
      errors: [
        {
          message:
            "Conditionally rendered repeated component 'InnerComponent' expected to have a 'key' attribute.",
          line: 5
        },
        {
          message:
            "Conditionally rendered repeated component 'InnerComponent' expected to have a 'key' attribute.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <ComponentA v-if="foo" />
            <ComponentA v-else-if="bar" />
            <ComponentB v-else />
          </div>
        </template>
        <script>
        export default {
          components: {
            ComponentA,
            ComponentB
          }
        }
        </script>
        `,
      output: `
        <template>
          <div>
            <ComponentA key="component-a-1" v-if="foo" />
            <ComponentA key="component-a-2" v-else-if="bar" />
            <ComponentB v-else />
          </div>
        </template>
        <script>
        export default {
          components: {
            ComponentA,
            ComponentB
          }
        }
        </script>
        `,
      errors: [
        {
          message:
            "Conditionally rendered repeated component 'ComponentA' expected to have a 'key' attribute.",
          line: 4
        },
        {
          message:
            "Conditionally rendered repeated component 'ComponentA' expected to have a 'key' attribute.",
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <ComponentA v-if="foo" />
            <ComponentB v-else-if="bar" />
            <ComponentA v-else />
          </div>
        </template>
        <script>
        export default {
          components: {
            ComponentA,
            ComponentB
          }
        }
        </script>
        `,
      output: `
        <template>
          <div>
            <ComponentA key="component-a-1" v-if="foo" />
            <ComponentB v-else-if="bar" />
            <ComponentA key="component-a-2" v-else />
          </div>
        </template>
        <script>
        export default {
          components: {
            ComponentA,
            ComponentB
          }
        }
        </script>
        `,
      errors: [
        {
          message:
            "Conditionally rendered repeated component 'ComponentA' expected to have a 'key' attribute.",
          line: 4
        },
        {
          message:
            "Conditionally rendered repeated component 'ComponentA' expected to have a 'key' attribute.",
          line: 6
        }
      ]
    }
  ]
})
