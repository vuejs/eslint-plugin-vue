/**
 * @author Yosuke Ota
 */
'use strict'

const rule = require('../../../lib/rules/component-name-in-template-casing')
const semver = require('semver')
const RuleTester = require('../../eslint-compat').RuleTester

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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
    {
      code: '<template><component is="div" /></template>',
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
    {
      code: '<template><component is="div" /></template>',
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

    // globals with regex patterns
    {
      code: `
        <template>
          <div>
            <c-button />
            <c-card />
            <c-input />
            <other-component />
          </div>
        </template>
      `,
      options: ['kebab-case', { globals: ['/^c-/', 'other-component'] }]
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
            languageOptions: {
              parserOptions: {
                parser: require.resolve('@typescript-eslint/parser')
              }
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
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 25
        },
        {
          message: 'Component name "coolComponent" is not kebab-case.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 25
        },
        {
          message: 'Component name "Cool-component" is not kebab-case.',
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 25
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "TheComponent" is not kebab-case.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 22
        }
      ]
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
      errors: [
        {
          message: 'Component name "TheComponent" is not kebab-case.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 22
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "theComponent" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 22
        }
      ]
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
      errors: [
        {
          message: 'Component name "theComponent" is not kebab-case.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 22
        }
      ]
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
      errors: [
        {
          message: 'Component name "The-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "The-component" is not kebab-case.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "Thecomponent" is not kebab-case.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 22
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        }
      ]
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
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 25
        },
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 23
        }
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
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 25
        },
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 23
        }
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
        {
          message: 'Component name "foo--bar" is not kebab-case.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 18
        },
        {
          message: 'Component name "Foo--Bar" is not kebab-case.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 18
        },
        {
          message: 'Component name "FooBar" is not kebab-case.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 16
        },
        {
          message: 'Component name "FooBar_Baz-qux" is not kebab-case.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 24
        }
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
          <component />
          <Suspense />
          <Teleport />
          <ClientOnly />
          <KeepAlive />
        </template>
      `,
      options: ['PascalCase', { registeredComponentsOnly: false }],
      errors: [
        {
          message: 'Component name "suspense" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 20
        },
        {
          message: 'Component name "teleport" is not PascalCase.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 20
        },
        {
          message: 'Component name "client-only" is not PascalCase.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 23
        },
        {
          message: 'Component name "keep-alive" is not PascalCase.',
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 22
        }
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
      errors: [
        {
          message: 'Component name "the-component" is not PascalCase.',
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 25
        }
      ]
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
      errors: [
        {
          message: 'Component name "TheComponent" is not kebab-case.',
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 24
        }
      ]
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
          column: 11,
          endLine: 3,
          endColumn: 23
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
          column: 11,
          endLine: 3,
          endColumn: 22
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
          column: 11,
          endLine: 3,
          endColumn: 22
        }
      ]
    },
    {
      code: `
        <template>
          <c-button />
          <c-card />
          <c-input />
        </template>
      `,
      output: `
        <template>
          <CButton />
          <CCard />
          <CInput />
        </template>
      `,
      options: ['PascalCase', { globals: ['/^c-/'] }],
      errors: [
        {
          message: 'Component name "c-button" is not PascalCase.',
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 20
        },
        {
          message: 'Component name "c-card" is not PascalCase.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 18
        },
        {
          message: 'Component name "c-input" is not PascalCase.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 19
        }
      ]
    },
    {
      code: `
        <template>
          <CButton />
          <CCard />
          <CInput />
        </template>
      `,
      output: `
        <template>
          <c-button />
          <c-card />
          <c-input />
        </template>
      `,
      options: ['kebab-case', { globals: ['/^C[A-Z]/', '/^c-/'] }],
      errors: [
        {
          message: 'Component name "CButton" is not kebab-case.',
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 19
        },
        {
          message: 'Component name "CCard" is not kebab-case.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 17
        },
        {
          message: 'Component name "CInput" is not kebab-case.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 18
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
            languageOptions: {
              parserOptions: {
                parser: require.resolve('@typescript-eslint/parser')
              }
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
                <component />
              </template>
            `,
            errors: [
              {
                message: 'Component name "foo" is not PascalCase.',
                line: 13,
                column: 17,
                endLine: 13,
                endColumn: 21
              },
              {
                message: 'Component name "hello-world1" is not PascalCase.',
                line: 14,
                column: 17,
                endLine: 14,
                endColumn: 30
              },
              {
                message: 'Component name "hello-world2" is not PascalCase.',
                line: 15,
                column: 17,
                endLine: 15,
                endColumn: 30
              },
              {
                message: 'Component name "hello-world3" is not PascalCase.',
                line: 16,
                column: 17,
                endLine: 16,
                endColumn: 30
              },
              {
                message: 'Component name "hello-world4" is not PascalCase.',
                line: 17,
                column: 17,
                endLine: 17,
                endColumn: 30
              },
              {
                message: 'Component name "hello-world5" is not PascalCase.',
                line: 18,
                column: 17,
                endLine: 18,
                endColumn: 30
              }
            ]
          }
        ]
      : [])
  ]
})
