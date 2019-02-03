/**
 * @fileoverview Report used components
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unused-components')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

tester.run('no-unused-components', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `<template><div>Lorem ipsum</div></template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <h2>Lorem ipsum</h2>
        </div>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <TheButton />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <svg>
          <TheCircle />
        </svg>
      </template>
      <script>
        export default {
          components: {
            TheCircle
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <circle cx="0" cy="0" :d="radius" />
      </template>
      <script>
        export default {}
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component :is="'TheButton'" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="TheButton" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <theButton />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="theButton" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <the-button />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <the-button />
        </div>
      </template>
      <script>
        export default {
          components: {
            theButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="the-button" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <The-button />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="The-button" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <The-Button />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="The-Button" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <the-Button />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="the-Button" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <the-button />
          <next_Button />
        </div>
      </template>
      <script>
        export default {
          components: {
            'the-button': TheButton,
            'next_Button': NextButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <component is="the-button" />
          <component is="next_Button" />
        </div>
      </template>
      <script>
        export default {
          components: {
            'the-button': TheButton,
            'next_Button': NextButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div>
          <h2>Lorem ipsum</h2>
          <component is="TheButton" />
        </div>
      </template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div id="app">
          <Header></Header>
          <div class="content">
            <router-view></router-view>
          </div>
          <Footer />
        </div>
      </template>
      <script>
        import Header from 'components/Layout/Header';
        import Footer from 'components/Layout/Footer';

        export default {
          name: 'App',
          components: {
            Header,
            Footer,
          },
        };
      </script>`
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <component :is="dynamicComponent"></component>
        </div>
      </template>
      <script>
        import Foo from 'components/Foo';
        import Bar from 'components/Bar';

        export default {
          components: {
            Foo,
            Bar
          },
          computed: {
            dynamicComponent() {
              return '...'
            }
          }
        }
      </script>`,
      options: [{ ignoreWhenBindingPresent: true }]
    },

    // Ignore when `render` is used instead of template
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          components: {
            TheButton
          },
          render() {
            return
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template src="./test.html" />
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template src="./test.html"></template>
      <script>
        export default {
          components: {
            TheButton
          }
        }
      </script>`
    },

    // empty `:is`
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is=""></component>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is></component>
      </template>`
    },

    // computed properties
    {
      filename: 'test.vue',
      code: `
      <template>
        <div />
      </template>
      <script>
        export default {
          components: {
            [foo.bar]: baz
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div />
      </template>
      <script>
        export default {
          components: {
            [foo]: Bar
          }
        }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <foo />
      </template>
      <script>
        export default {
          components: {
            ['foo']: Foo
          }
        }
      </script>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <h2>Lorem ipsum</h2>
          </div>
        </template>
        <script>
          export default {
            components: {
              TheButton
            },
          }
        </script>
      `,
      errors: [{
        message: 'The "TheButton" component has been registered but not used.',
        line: 10
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <h2>Lorem ipsum</h2>
            <the_button />
          </div>
        </template>
        <script>
          export default {
            components: {
              TheButton
            },
          }
        </script>
      `,
      errors: [{
        message: 'The "TheButton" component has been registered but not used.',
        line: 11
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <h2>Lorem ipsum</h2>
            <TheButton />
          </div>
        </template>
        <script>
          export default {
            components: {
              'the-button': TheButton
            },
          }
        </script>
      `,
      errors: [{
        message: 'The "the-button" component has been registered but not used.',
        line: 11
      }]
    },
    // Setting: ignoreWhenBindingPresent
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <component :is="dynamicComponent"></component>
        </div>
      </template>
      <script>
        import Foo from 'components/Foo';
        import Bar from 'components/Bar';

        export default {
          components: {
            Foo,
            Bar
          },
          computed: {
            dynamicComponent() {
              return '...'
            }
          }
        }
      </script>`,
      options: [{ ignoreWhenBindingPresent: false }],
      errors: [{
        message: 'The "Foo" component has been registered but not used.',
        line: 13
      }, {
        message: 'The "Bar" component has been registered but not used.',
        line: 14
      }]
    },

    // empty `:is`
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is=""></component>
      </template>
      <script>
        export default {
          components: {
            Foo,
          },
        }
      </script>`,
      errors: [{
        message: 'The "Foo" component has been registered but not used.',
        line: 8
      }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is></component>
      </template>
      <script>
        export default {
          components: {
            Foo,
          },
        }
      </script>`,
      errors: [{
        message: 'The "Foo" component has been registered but not used.',
        line: 8
      }]
    },

    // computed properties
    {
      filename: 'test.vue',
      code: `
      <template>
        <div />
      </template>
      <script>
        export default {
          components: {
            ['foo']: Foo,
            [\`bar\`]: Bar,
            ['baz']: Baz,
            [qux]: Qux,
            ...components,
            quux,
          }
        }
      </script>`,
      errors: [{
        message: 'The "foo" component has been registered but not used.',
        line: 8
      }, {
        message: 'The "bar" component has been registered but not used.',
        line: 9
      }, {
        message: 'The "baz" component has been registered but not used.',
        line: 10
      }, {
        message: 'The "quux" component has been registered but not used.',
        line: 13
      }]
    }
  ]
})
