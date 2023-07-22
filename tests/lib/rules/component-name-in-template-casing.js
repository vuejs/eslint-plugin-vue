/**
 * @author Yosuke Ota
 */
'use strict'

const rule = require('../../../lib/rules/component-name-in-template-casing')
const semver = require('semver')
const RuleTester = require('eslint').RuleTester

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

tester.run('component-name-in-template-casing', rule, {
  valid: [
    // default
    {
      filename: 'test.vue',
      code: `
        <template>
          <!-- ✓ GOOD -->
          <CoolComponent />
          <UnregisteredComponent />
          <unregistered-component />
        </template>
        <script>
        export default {
          components: {
            CoolComponent
          }
        }
        </script>
      `
    },

    // element types test
    {
      code: '<template><div/></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><img></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><TheComponent/></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><svg><path/></svg></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><math><mspace/></math></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><div><slot></slot></div></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><div><template v-if="foo">bar</template></div></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><h1>Title</h1></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><h1 :is="customTitle">Title</h1></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><svg><TheComponent /></svg></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><text /></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><circle cx="0" cy="0" :d="radius"></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },

    // kebab-case
    {
      code: '<template><the-component></the-component></template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><div/></template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><img></template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><svg><path/></svg></template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><math><mspace/></math></template>',
      options: ['kebab-case', { registeredComponentsOnly: false }]
    },

    // ignores
    {
      code: '<template><custom-element></custom-element></template>',
      options: [
        'PascalCase',
        { ignores: ['custom-element'], registeredComponentsOnly: false }
      ]
    },
    {
      code: '<template><custom-element><TheComponent/></custom-element></template>',
      options: [
        'PascalCase',
        { ignores: ['custom-element'], registeredComponentsOnly: false }
      ]
    },
    // regexp ignores
    {
      filename: 'test.vue',
      code: `
        <template>
          <global-button />
          <globalCard />
          <global-grid />
        </template>
      `,
      options: [
        'PascalCase',
        { registeredComponentsOnly: false, ignores: ['/^global/'] }
      ]
    },

    // Invalid EOF
    {
      code: '<template><the-component a=">test</the-component></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },
    {
      code: '<template><the-component><!--test</the-component></template>',
      options: ['PascalCase', { registeredComponentsOnly: false }]
    },

    // built-in components (behave the same way as other components)
    `
      <template>
        <component />
        <suspense />
        <teleport />
        <client-only />
        <keep-alive />
      </template>
    `,

    {
      filename: 'test.vue',
      code: `
        <template><div/></template>
        <script setup>const Div = 0</script>
      `,
      options: ['PascalCase']
    },

    // globals
    {
      code: `
        <template>
          <div>
            <RouterView />
            <RouterLink />
          </div>
        </template>
      `,
      options: ['PascalCase', { globals: ['RouterView', 'router-link'] }]
    },
    {
      code: `
        <template>
          <div>
            <router-view />
            <router-link />
          </div>
        </template>
      `,
      options: ['kebab-case', { globals: ['RouterView', 'router-link'] }]
    },

    // type-only imports
    ...(semver.gte(
      require('@typescript-eslint/parser/package.json').version,
      '5.0.0'
    )
      ? [
          {
            code: `
              <script setup lang="ts">
                import type Foo from './Foo.vue'
                import type { HelloWorld1 } from './components/HelloWorld'
                import { type HelloWorld2 } from './components/HelloWorld2'
                import type { HelloWorld as HelloWorld3 } from './components/HelloWorld3'
                import { type HelloWorld as HelloWorld4 } from './components/HelloWorld4';
                import { type default as HelloWorld5 } from './components/HelloWorld5';
                import { type Component } from 'vue';
              </script>

              <template>
                <foo />
                <hello-world1 />
                <hello-world2 />
                <hello-world3 />
                <hello-world4 />
                <hello-world5 />
                <component />
              </template>
            `,
            options: ['PascalCase', { registeredComponentsOnly: true }],
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            }
          }
        ]
      : [])
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <!-- ✗ BAD -->
          <cool-component />
          <coolComponent />
          <Cool-component />
        </template>
        <script>
        export default {
          components: {
            CoolComponent
          }
        }
        </script>
      `,
      output: `
        <template>
          <!-- ✗ BAD -->
          <CoolComponent />
          <CoolComponent />
          <CoolComponent />
        </template>
        <script>
        export default {
          components: {
            CoolComponent
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Component name "cool-component" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 26
        },
        {
          message: 'Component name "coolComponent" is not PascalCase.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 25
        },
        {
          message: 'Component name "Cool-component" is not PascalCase.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <!-- ✗ BAD -->
          <CoolComponent />
          <coolComponent />
          <Cool-component />
        </template>
        <script>
        export default {
          components: {
            CoolComponent
          }
        }
        </script>
      `,
      output: `
        <template>
          <!-- ✗ BAD -->
          <cool-component />
          <cool-component />
          <cool-component />
        </template>
        <script>
        export default {
          components: {
            CoolComponent
          }
        }
        </script>
      `,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Component name "CoolComponent" is not kebab-case.',
          line: 4
        },
        {
          message: 'Component name "coolComponent" is not kebab-case.',
          line: 5
        },
        {
          message: 'Component name "Cool-component" is not kebab-case.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <svg>
          <the-component />
        </svg>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <svg>
          <TheComponent />
        </svg>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component id="id">
          <!-- comment -->
        </the-component>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent id="id">
          <!-- comment -->
        </TheComponent>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component :is="componentName">
          content
        </the-component>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent :is="componentName">
          content
        </TheComponent>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component id="id"/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent id="id"/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <TheComponent id="id">
          <!-- comment -->
        </TheComponent>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <the-component id="id">
          <!-- comment -->
        </the-component>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['kebab-case'],
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
      <template>
        <TheComponent id="id"/>
      </template>
      `,
      output: `
      <template>
        <the-component id="id"/>
      </template>
      `,
      options: ['kebab-case', { registeredComponentsOnly: false }],
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component
          id="id"/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent
          id="id"/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component></the-component>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent></TheComponent>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <theComponent/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "theComponent" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <theComponent/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <the-component/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['kebab-case'],
      errors: ['Component name "theComponent" is not kebab-case.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <The-component/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "The-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <The-component/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <the-component/>
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['kebab-case'],
      errors: ['Component name "The-component" is not kebab-case.']
    },
    {
      code: `
      <template>
        <Thecomponent/>
      </template>
      `,
      output: `
      <template>
        <thecomponent/>
      </template>
      `,
      options: ['kebab-case', { registeredComponentsOnly: false }],
      errors: ['Component name "Thecomponent" is not kebab-case.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component></the-component  >
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent></TheComponent  >
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component></the-component
        >
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent></TheComponent
        >
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <the-component></the-component end-tag-attr="attr" >
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      output: `
      <template>
        <TheComponent></TheComponent end-tag-attr="attr" >
      </template>
      <script>
      export default {
        components: {TheComponent}
      }
      </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },

    // ignores
    {
      code: `
      <template>
        <custom-element1>
          <the-component />
        </custom-element1>
        <custom-element2 />
        <the-component />
      </template>`,
      output: `
      <template>
        <custom-element1>
          <TheComponent />
        </custom-element1>
        <custom-element2 />
        <TheComponent />
      </template>`,
      options: [
        'PascalCase',
        {
          ignores: ['custom-element1', 'custom-element2'],
          registeredComponentsOnly: false
        }
      ],
      errors: [
        'Component name "the-component" is not PascalCase.',
        'Component name "the-component" is not PascalCase.'
      ]
    },
    {
      code: `
      <template>
        <custom-element1>
          <the-component />
        </custom-element1>
        <custom-element2 />
        <the-component />
      </template>`,
      output: `
      <template>
        <custom-element1>
          <TheComponent />
        </custom-element1>
        <custom-element2 />
        <TheComponent />
      </template>`,
      options: [
        'PascalCase',
        {
          ignores: ['/^custom-element/'],
          registeredComponentsOnly: false
        }
      ],
      errors: [
        'Component name "the-component" is not PascalCase.',
        'Component name "the-component" is not PascalCase.'
      ]
    },
    {
      code: `
      <template>
        <foo--bar />
        <Foo--Bar />
        <FooBar />
        <FooBar_Baz-qux />
      </template>`,
      output: `
      <template>
        <foo--bar />
        <Foo--Bar />
        <foo-bar />
        <foo-bar-baz-qux />
      </template>`,
      options: [
        'kebab-case',
        {
          registeredComponentsOnly: false
        }
      ],
      errors: [
        'Component name "foo--bar" is not kebab-case.',
        'Component name "Foo--Bar" is not kebab-case.',
        'Component name "FooBar" is not kebab-case.',
        'Component name "FooBar_Baz-qux" is not kebab-case.'
      ]
    },
    {
      // built-in components (behave the same way as other components)
      code: `
        <template>
          <component />
          <suspense />
          <teleport />
          <client-only />
          <keep-alive />
        </template>
      `,
      output: `
        <template>
          <Component />
          <Suspense />
          <Teleport />
          <ClientOnly />
          <KeepAlive />
        </template>
      `,
      options: ['PascalCase', { registeredComponentsOnly: false }],
      errors: [
        'Component name "component" is not PascalCase.',
        'Component name "suspense" is not PascalCase.',
        'Component name "teleport" is not PascalCase.',
        'Component name "client-only" is not PascalCase.',
        'Component name "keep-alive" is not PascalCase.'
      ]
    },
    {
      code: `
        <template>
          <the-component />
        </template>
        <script setup>
          import TheComponent from '@/components/theComponent.vue'
        </script>
      `,
      output: `
        <template>
          <TheComponent />
        </template>
        <script setup>
          import TheComponent from '@/components/theComponent.vue'
        </script>
      `,
      options: ['PascalCase'],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
        <template>
          <TheComponent />
        </template>
        <script setup>
          import TheComponent from '@/components/theComponent.vue'
        </script>
      `,
      output: `
        <template>
          <the-component />
        </template>
        <script setup>
          import TheComponent from '@/components/theComponent.vue'
        </script>
      `,
      options: ['kebab-case'],
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
        <template>
          <router-view />
        </template>
      `,
      output: `
        <template>
          <RouterView />
        </template>
      `,
      options: ['PascalCase', { globals: ['RouterView'] }],
      errors: [
        {
          message: 'Component name "router-view" is not PascalCase.',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `
        <template>
          <RouterView />
        </template>
      `,
      output: `
        <template>
          <router-view />
        </template>
      `,
      options: ['kebab-case', { globals: ['RouterView'] }],
      errors: [
        {
          message: 'Component name "RouterView" is not kebab-case.',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `
        <template>
          <RouterView />
        </template>
      `,
      output: `
        <template>
          <router-view />
        </template>
      `,
      options: ['kebab-case', { globals: ['router-view'] }],
      errors: [
        {
          message: 'Component name "RouterView" is not kebab-case.',
          line: 3,
          column: 11
        }
      ]
    },
    // type-only imports
    ...(semver.gte(
      require('@typescript-eslint/parser/package.json').version,
      '5.0.0'
    )
      ? [
          {
            code: `
              <script setup lang="ts">
                import type Foo from './Foo.vue'
                import type { HelloWorld1 } from './components/HelloWorld'
                import { type HelloWorld2 } from './components/HelloWorld2'
                import type { HelloWorld as HelloWorld3 } from './components/HelloWorld3'
                import { type HelloWorld as HelloWorld4 } from './components/HelloWorld4';
                import { type default as HelloWorld5 } from './components/HelloWorld5';
                import { type Component } from 'vue';
              </script>

              <template>
                <foo />
                <hello-world1 />
                <hello-world2 />
                <hello-world3 />
                <hello-world4 />
                <hello-world5 />
                <component />
              </template>
            `,
            options: ['PascalCase', { registeredComponentsOnly: false }],
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            output: `
              <script setup lang="ts">
                import type Foo from './Foo.vue'
                import type { HelloWorld1 } from './components/HelloWorld'
                import { type HelloWorld2 } from './components/HelloWorld2'
                import type { HelloWorld as HelloWorld3 } from './components/HelloWorld3'
                import { type HelloWorld as HelloWorld4 } from './components/HelloWorld4';
                import { type default as HelloWorld5 } from './components/HelloWorld5';
                import { type Component } from 'vue';
              </script>

              <template>
                <Foo />
                <HelloWorld1 />
                <HelloWorld2 />
                <HelloWorld3 />
                <HelloWorld4 />
                <HelloWorld5 />
                <Component />
              </template>
            `,
            errors: [
              {
                message: 'Component name "foo" is not PascalCase.',
                line: 13,
                column: 17
              },
              {
                message: 'Component name "hello-world1" is not PascalCase.',
                line: 14,
                column: 17
              },
              {
                message: 'Component name "hello-world2" is not PascalCase.',
                line: 15,
                column: 17
              },
              {
                message: 'Component name "hello-world3" is not PascalCase.',
                line: 16,
                column: 17
              },
              {
                message: 'Component name "hello-world4" is not PascalCase.',
                line: 17,
                column: 17
              },
              {
                message: 'Component name "hello-world5" is not PascalCase.',
                line: 18,
                column: 17
              },
              {
                message: 'Component name "component" is not PascalCase.',
                line: 19,
                column: 17
              }
            ]
          }
        ]
      : [])
  ]
})
