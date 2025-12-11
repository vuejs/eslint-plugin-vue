/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-undef-directives')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-undef-directives', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-text="text"></div>
        <div v-html="html"></div>
        <div v-show="true"></div>
        <div v-if="true"></div>
        <div v-else-if="true"></div>
        <div v-else></div>
        <div v-for="item in items"></div>
        <div v-bind:id="id"></div>
        <div :id="id"></div>
        <div v-on:click="click"></div>
        <div @click="click"></div>
        <div v-model="value"></div>
        <div v-pre></div>
        <div v-cloak></div>
        <div v-once></div>
        <div v-memo="[value]"></div>
        <slot v-bind="item"></slot>
        <component v-bind:is="'div'"></component>
        <template v-slot:default></template>
        <template #default></template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vFocus from './vFocus'
      const vFoo = {}
      </script>
      <template>
        <div v-focus>
        <div v-foo></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vFocus from './vFocus'
      </script>
      <template>
        <div v-Focus>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vFocus from './vFocus'
      </script>
      <template>
        <div v-focus.foo>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vFocus from './vFocus'
      </script>
      <template>
        <div v-focus:foo>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vFocus from './vFocus'
      </script>
      <template>
        <div v-focus:foo.bar>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vFocus from './vFocus'
      </script>
      <template>
        <div v-focus:[arg]>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {focus as vFocus} from './vFocus'
      </script>
      <template>
        <div v-focus.foo>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vClickOutside from './vClickOutside'
      </script>
      <template>
        <div v-click-outside>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vClickOutside from './vClickOutside'
      </script>
      <template>
        <div v-clickOutside>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          focus: {},
        }
      }
      </script>
      <template>
        <div v-focus>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          fooBar: {}
        }
      }
      </script>
      <template>
        <div v-foo-bar></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          fooBar: {}
        }
      }
      </script>
      <template>
        <div v-fooBar></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          'foo-bar': {}
        }
      }
      </script>
      <template>
        <div v-foo-bar></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          Focus: {}
        }
      }
      </script>
      <template>
        <div v-focus>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-foo></div>
      </template>
      `,
      options: [{ ignorePatterns: ['foo'] }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-focus>
      </template>
      `,
      errors: [
        {
          message: "The 'v-focus' directive has been used, but not defined.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const vfocus = {} // should be vFocus
      </script>
      <template>
        <div v-focus>
      </template>
      `,
      errors: [
        {
          message: "The 'v-focus' directive has been used, but not defined.",
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { foo as bar } from './foo'
      </script>
      <template>
        <div v-foo></div>
      </template>
      `,
      errors: [
        {
          message: "The 'v-foo' directive has been used, but not defined.",
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import focus from './focus'
      </script>
      <template>
        <div v-focus>
      </template>
      `,
      errors: [
        {
          message: "The 'v-focus' directive has been used, but not defined.",
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vClickOutside from './vClickOutside'
      </script>
      <template>
        <div v-clickoutside>
      </template>
      `,
      errors: [
        {
          message:
            "The 'v-clickoutside' directive has been used, but not defined.",
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import vClickoutside from './vClickOutside'
      </script>
      <template>
        <div v-click-outside>
      </template>
      `,
      errors: [
        {
          message:
            "The 'v-click-outside' directive has been used, but not defined.",
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-foo:[arg]></div>
      </template>
      `,
      errors: [
        {
          message: "The 'v-foo' directive has been used, but not defined.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-foo.bar></div>
      </template>
      `,
      errors: [
        {
          message: "The 'v-foo' directive has been used, but not defined.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-foo:bar.baz></div>
      </template>
      `,
      errors: [
        {
          message: "The 'v-foo' directive has been used, but not defined.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          focus: {}
        }
      }
      </script>
      <template>
        <div v-Focus>
      </template>
      `,
      errors: [
        {
          message: "The 'v-Focus' directive has been used, but not defined.",
          line: 10,
          column: 14,
          endLine: 10,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        directives: {
          foobar: {}
        }
      }
      </script>
      <template>
        <div v-foo-bar></div>
      </template>
      `,
      errors: [
        {
          message: "The 'v-foo-bar' directive has been used, but not defined.",
          line: 10,
          column: 14,
          endLine: 10,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-foo-bar></div>
      </template>
      `,
      options: [{ ignorePatterns: ['baz'] }],
      errors: [
        {
          message: "The 'v-foo-bar' directive has been used, but not defined.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 23
        }
      ]
    }
  ]
})
