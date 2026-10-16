/**
 * @author Dominik Ivanov
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/template-wrapper-directive-style'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('template-wrapper-directive-style', rule, {
  valid: [
    // no directives at all
    {
      filename: 'test.vue',
      code: '<template><div class="a"></div></template>'
    },
    // "always" (default): directives on <template> are fine
    {
      filename: 'test.vue',
      code: '<template><template v-if="a"><div /></template></template>'
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-if="a"><div /></template>
        <template v-else-if="b"><span /></template>
        <template v-else><p /></template>
      </template>`
    },
    {
      filename: 'test.vue',
      code: '<template><template v-for="item in items" :key="item.id"><MyItem /></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template v-if="a" v-for="item in items"><div /></template></template>',
      options: [{ style: 'always' }]
    },
    // other directives are not checked
    {
      filename: 'test.vue',
      code: '<template><div v-show="a" v-bind:class="b" @click="c"></div></template>'
    },
    // "never": directives on elements and components are fine
    {
      filename: 'test.vue',
      code: '<template><div v-if="a"></div><span v-else></span></template>',
      options: [{ style: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyItem v-for="item in items" :key="item.id" /></template>',
      options: [{ style: 'never' }]
    },
    // slot templates are always ignored
    {
      filename: 'test.vue',
      code: '<template><MyComp><template #header v-if="a">x</template></MyComp></template>',
      options: [{ style: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComp><template v-slot:header v-if="a">x</template></MyComp></template>',
      options: [{ style: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComp><template slot="header" v-if="a">x</template></MyComp></template>',
      options: [{ style: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComp><template slot-scope="props" v-if="a">x</template></MyComp></template>',
      options: [{ style: 'never' }]
    },
    // <Transition> / <KeepAlive> / <TransitionGroup> compile to the same code with a
    // single-child <template> wrapper, so they get no exception
    {
      filename: 'test.vue',
      code: '<template><Transition><template v-if="show"><p>hello</p></template></Transition></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><KeepAlive><template v-if="show"><CompA /></template><template v-else><CompB /></template></KeepAlive></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><TransitionGroup><template v-for="i in items" :key="i"><li>{{ i }}</li></template></TransitionGroup></template>'
    },
    // "never": slot templates combined with v-for or a dynamic slot name are ignored
    {
      filename: 'test.vue',
      code: '<template><MyComp><template #default v-for="x in xs">{{ x }}</template></MyComp></template>',
      options: [{ style: 'never' }]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComp><template #[name] v-if="a">x</template></MyComp></template>',
      options: [{ style: 'never' }]
    }
  ],
  invalid: [
    // "always": a component with v-slot is still an element, its v-if is reported
    {
      filename: 'test.vue',
      code: '<template><MyComp v-slot="props" v-if="a">x</MyComp></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    // "never": nested wrappers are both reported
    {
      filename: 'test.vue',
      code: '<template><template v-if="a"><template v-if="b"><div /></template></template></template>',
      options: [{ style: 'never' }],
      errors: [
        {
          messageId: 'disallowTemplate',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 29
        },
        {
          messageId: 'disallowTemplate',
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    // "never": the whole <template> chain is reported
    {
      filename: 'test.vue',
      code: '<template><template v-if="a"><p /></template><template v-else-if="b"><p /></template><template v-else><p /></template></template>',
      options: [{ style: 'never' }],
      errors: [
        {
          messageId: 'disallowTemplate',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 29
        },
        {
          messageId: 'disallowTemplate',
          line: 1,
          column: 56,
          endLine: 1,
          endColumn: 69
        },
        {
          messageId: 'disallowTemplate',
          line: 1,
          column: 96,
          endLine: 1,
          endColumn: 102
        }
      ]
    },
    // "always": direct children of <Transition> / <KeepAlive> are reported too
    {
      filename: 'test.vue',
      code: '<template><Transition><p v-if="show">hello</p></Transition></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><KeepAlive><Comp v-if="show" /></KeepAlive></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    // "always": v-if on an HTML element
    {
      filename: 'test.vue',
      code: '<template><div v-if="a"></div></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          data: { directive: 'v-if', element: 'div' },
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    // "always": the whole v-if / v-else-if / v-else chain is reported
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a"></div>
        <span v-else-if="b"></span>
        <p v-else></p>
      </template>`,
      errors: [
        {
          messageId: 'requireTemplate',
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 22
        },
        {
          messageId: 'requireTemplate',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 28
        },
        {
          messageId: 'requireTemplate',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    // "always": v-for on a component
    {
      filename: 'test.vue',
      code: '<template><MyItem v-for="item in items" :key="item.id" /></template>',
      options: [{ style: 'always' }],
      errors: [
        {
          messageId: 'requireTemplate',
          data: { directive: 'v-for', element: 'MyItem' },
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    // "always": <slot> and <component> are not <template>
    {
      filename: 'test.vue',
      code: '<template><slot v-if="a" /><component :is="c" v-for="c in cs" /></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 25
        },
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 47,
          endLine: 1,
          endColumn: 62
        }
      ]
    },
    // "always": mixed style, only the element branch is reported
    {
      filename: 'test.vue',
      code: '<template><template v-if="a"><div /></template><div v-else></div></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 59
        }
      ]
    },
    // "always": both directives on one element are reported
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in xs" v-if="x"></div></template>',
      errors: [
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 31
        },
        {
          messageId: 'requireTemplate',
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    // "never": directives on a <template> wrapper
    {
      filename: 'test.vue',
      code: '<template><template v-if="a"><div /></template></template>',
      options: [{ style: 'never' }],
      errors: [
        {
          messageId: 'disallowTemplate',
          data: { directive: 'v-if' },
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-for="item in items" :key="item.id">
          <MyItem />
          <MyOther />
        </template>
      </template>`,
      options: [{ style: 'never' }],
      errors: [
        {
          messageId: 'disallowTemplate',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 40
        }
      ]
    }
  ]
})
