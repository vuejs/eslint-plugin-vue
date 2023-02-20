/**
 * @fileoverview enforce ordering of attributes
 * @author Erin Depew
 */
'use strict'

const rule = require('../../../lib/rules/attributes-order')
const RuleTester = require('eslint').RuleTester

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})
tester.run('attributes-order', rule, {
  valid: [
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1433
      filename: 'test.vue',
      code: `
      <template>
        <div
          ref="ref"
          v-model="model"
          v-bind="object"
          @click="handleClick"/>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind="object"
          ref="ref"
          v-model="model"
          @click="handleClick"/>
      </template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div is="header"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="item in items"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="!visible"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-else-if="!visible"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-else="!visible"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="!visible"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div id="header"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div key="id"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-html="htmlContent"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text="textContent"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-model="toggle"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-custom-directive></div></template>'
    },
    {
      filename: 'test.vue',
      code: `<template>
        <div
          v-model="toggle"
          :bindingProp="foo"
          propOne="bar"
          model="baz">
        </div>
      </template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div click="functionCall"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div myProp="prop"></div></template>'
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            is="header"
            v-for="item in items"
            v-if="!visible"
            v-once
            id="uniqueID"
            ref="header"
            v-model="headerData"
            myProp="prop"
            @click="functionCall"
            v-text="textContent">
          </div>
        </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            is="header"
            v-for="item in items"
            v-if="!visible"
            v-once
            id="uniqueID"
            ref="header"
            v-model="headerData"
            :myProp="prop"
            v-on="functionCall"
            v-text="textContent">
          </div>
        </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            is="header"
            v-for="item in items"
            v-if="!visible"
            v-once
            id="uniqueID"
            ref="header"
            :prop="headerData"
            myProp="prop"
            v-on:click="functionCall"
            v-text="textContent">
          </div>
        </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-for="item in items"
            v-if="!visible"
            propone="prop"
            :proptwo="prop"
            propthree="prop"
            @click="functionCall"
            v-text="textContent">
          </div>
        </template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div propone="prop" proptwo="prop" propthree="prop"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div propone="prop" proptwo="prop" is="header"></div></template>',
      options: [
        {
          order: [
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
            'DEFINITION'
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div ref="header" is="header" propone="prop" proptwo="prop"></div></template>',
      options: [
        {
          order: [
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'DEFINITION',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT'
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-if="!visible"
            v-for="item in items"
            v-once
            is="header"
            v-on:click="functionCall"
            ref="header"
            v-text="textContent"
            id="uniqueID"
            :prop="headerData"
            myProp="prop"
            >
          </div>
        </template>`,
      options: [
        {
          order: [
            'CONDITIONALS',
            'LIST_RENDERING',
            'RENDER_MODIFIERS',
            'DEFINITION',
            'EVENTS',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'CONTENT',
            'GLOBAL',
            'OTHER_ATTR',
            'OTHER_DIRECTIVES'
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-if="!visible"
            class="content"
            v-model="foo"
            v-text="textContent"
            >
          </div>
        </template>`,
      options: [
        {
          order: [
            'CONDITIONALS',
            'LIST_RENDERING',
            'RENDER_MODIFIERS',
            'DEFINITION',
            'EVENTS',
            'UNIQUE',
            ['TWO_WAY_BINDING', 'OTHER_ATTR'],
            'CONTENT',
            'GLOBAL'
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            id="uniqueID"
            ref="header"
            :prop="headerData"
            :[a+b]="headerData"
            :[prop]="headerData"
            myProp="prop"
            v-on:click="functionCall"
            v-on:[c]="functionCall"
            v-text="textContent">
          </div>
        </template>`
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            a-custom-prop="value"
            :another-custom-prop="value"
            :blue-color="false"
            boolean-prop
            z-prop="Z"
            v-on:[c]="functionCall"
            @change="functionCall"
            v-on:click="functionCall"
            @input="functionCall"
            v-text="textContent">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            class="foo"
            :class="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'duplicate.vue',
      code: `<template>
          <div
            class="foo"
            class="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'duplicate.vue',
      code: `<template>
          <div
            :class="foo"
            :class="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-if="foo"
            v-show="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-bar="bar"
            v-foo="foo">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-foo.a="a"
            v-foo.b="b">
          </div>
        </template>`,
      options: [{ alphabetical: true }]
    },

    // v-bind="..."
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind:id="a"
          v-bind="b">
        </div>
      </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind="b"
          v-bind:id="a">
        </div>
      </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="x"
          v-bind:id="a"
          v-bind="b">
        </div>
      </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="x"
          v-bind="b"
          v-bind:id="a">
        </div>
      </template>`,
      options: [{ alphabetical: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="x"
          v-bind="b"
          v-model="c"
          v-bind:value="a">
        </div>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="x"
          v-model="c"
          v-bind="b"
          v-bind:value="a">
        </div>
      </template>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="x"
          v-bind="b"
          v-bind:id="a"
          v-model="c">
        </div>
      </template>`
    },

    // omit order
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-for="a in items"
          v-if="a"
          attr="a">
        </div>
      </template>`,
      options: [{ order: ['LIST_RENDERING', 'CONDITIONALS'] }]
    },

    // https://github.com/vuejs/eslint-plugin-vue/issues/1728
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          :prop-bind="prop"
          prop-one="prop"
          prop-two="prop">
        </div>
      </template>`,
      options: [
        {
          order: ['ATTR_DYNAMIC', 'ATTR_STATIC'],
          alphabetical: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-model="a
          :class="b"
          :is="c"
          prop-one="d"
          class="e"
          prop-two="f">
        </div>
      </template>`,
      options: [
        {
          order: ['TWO_WAY_BINDING', 'ATTR_DYNAMIC', 'ATTR_STATIC'],
          alphabetical: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          prop-one="a"
          prop-three="b"
          :prop-two="c">
        </div>
      </template>`,
      options: [
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'ATTR_STATIC',
            'ATTR_DYNAMIC',
            'EVENTS',
            'CONTENT'
          ],
          alphabetical: false
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          prop-one="a"
          :prop-two="b"
          prop-three="c">
        </div>
      </template>`,
      options: [
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            ['ATTR_STATIC', 'ATTR_DYNAMIC'],
            'EVENTS',
            'CONTENT'
          ],
          alphabetical: false
        }
      ]
    },

    // https://github.com/vuejs/eslint-plugin-vue/issues/1870
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          boolean-prop
          prop-one="a"
          prop-two="b"
          :prop-three="c">
        </div>
      </template>`,
      options: [
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'ATTR_SHORTHAND_BOOL',
            'ATTR_STATIC',
            'ATTR_DYNAMIC',
            'EVENTS',
            'CONTENT'
          ],
          alphabetical: false
        }
      ]
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-cloak is="header"></div></template>',
      output: '<template><div is="header" v-cloak></div></template>',
      errors: [
        {
          message: 'Attribute "is" should go before "v-cloak".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div id="uniqueID" v-cloak></div></template>',
      output: '<template><div v-cloak id="uniqueID"></div></template>',
      errors: [
        {
          message: 'Attribute "v-cloak" should go before "id".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
            <div
              model="baz"
              v-model="toggle"
              propOne="bar"
              :id="foo">
            </div>
          </template>`,
      output: `<template>
            <div
              v-model="toggle"
              model="baz"
              :id="foo"
              propOne="bar">
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "v-model" should go before "model".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute ":id" should go before "propOne".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
            <div
              :bindingProp="foo"
              model="baz"
              v-on="functionCall"
              v-model="toggle"
              propOne="bar">
            </div>
          </template>`,
      output: `<template>
            <div
              :bindingProp="foo"
              model="baz"
              v-model="toggle"
              v-on="functionCall"
              propOne="bar">
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "v-model" should go before "v-on".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "propOne" should go before "v-on".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div data-id="foo" aria-test="bar" is="custom" myProp="prop"></div></template>',
      output:
        '<template><div data-id="foo" is="custom" aria-test="bar" myProp="prop"></div></template>',
      errors: [
        {
          message: 'Attribute "is" should go before "aria-test".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div ref="header" propone="prop" is="header" ></div></template>',
      options: [
        {
          order: [
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'DEFINITION',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT'
          ]
        }
      ],
      output:
        '<template><div ref="header" is="header" propone="prop" ></div></template>',
      errors: [
        {
          message: 'Attribute "is" should go before "propone".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
            <div v-cloak
              is="header">
            </div>
          </template>`,
      output: `<template>
            <div is="header"
              v-cloak>
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "is" should go before "v-cloak".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
            <div
              v-if="!visible"
              v-for="item in items"
              v-once
              is="header"
              v-on:click="functionCall"
              ref="header"
              :prop="headerData"
              v-text="textContent"
              id="uniqueID"
              myProp="prop"
              >
            </div>
          </template>`,
      output: `<template>
            <div
              v-for="item in items"
              v-if="!visible"
              is="header"
              v-once
              ref="header"
              v-on:click="functionCall"
              :prop="headerData"
              id="uniqueID"
              v-text="textContent"
              myProp="prop"
              >
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "v-for" should go before "v-if".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "is" should go before "v-once".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "ref" should go before "v-on:click".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute ":prop" should go before "v-on:click".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "id" should go before "v-text".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "myProp" should go before "v-text".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
            <div
              v-if="!visible"
              v-for="item in items"
              v-once
              is="header"
              v-on:click="functionCall"
              ref="header"
              :prop="headerData"
              v-text="textContent"
              id="uniqueID"
              myProp="prop"
              >
            </div>
          </template>`,
      options: [
        {
          order: [
            'EVENTS',
            'TWO_WAY_BINDING',
            'UNIQUE',
            'DEFINITION',
            'CONDITIONALS',
            'LIST_RENDERING',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'OTHER_ATTR',
            'OTHER_DIRECTIVES',
            'CONTENT'
          ]
        }
      ],
      output: `<template>
            <div
              v-if="!visible"
              v-for="item in items"
              is="header"
              v-once
              v-on:click="functionCall"
              ref="header"
              :prop="headerData"
              id="uniqueID"
              v-text="textContent"
              myProp="prop"
              >
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "is" should go before "v-once".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "v-on:click" should go before "v-once".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "ref" should go before "v-once".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "id" should go before "v-text".',
          type: 'VAttribute'
        },
        {
          message: 'Attribute "myProp" should go before "v-text".',
          type: 'VAttribute'
        }
      ]
    },
    {
      code: `<template>
            <div
              class="content"
              v-if="!visible"
              v-model="foo"
              v-text="textContent"
              >
            </div>
          </template>`,
      options: [
        {
          order: [
            'CONDITIONALS',
            'LIST_RENDERING',
            'RENDER_MODIFIERS',
            'DEFINITION',
            'EVENTS',
            'UNIQUE',
            ['TWO_WAY_BINDING', 'OTHER_ATTR'],
            'CONTENT',
            'GLOBAL'
          ]
        }
      ],
      output: `<template>
            <div
              v-if="!visible"
              class="content"
              v-model="foo"
              v-text="textContent"
              >
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "v-if" should go before "class".',
          type: 'VAttribute'
        }
      ]
    },
    {
      code: `<template>
            <my-component
              v-if="!visible"
              v-model="content"
              v-slot="textContent"
              >
            </my-component>
          </template>`,
      output: `<template>
            <my-component
              v-if="!visible"
              v-slot="textContent"
              v-model="content"
              >
            </my-component>
          </template>`,
      errors: [
        {
          message: 'Attribute "v-slot" should go before "v-model".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            z-prop="Z"
            a-prop="A">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            a-prop="A"
            z-prop="Z">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "a-prop" should go before "z-prop".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            :z-prop="Z"
            :a-prop="A">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            :a-prop="A"
            :z-prop="Z">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute ":a-prop" should go before ":z-prop".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            @input="bar"
            @change="foo">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            @change="foo"
            @input="bar">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "@change" should go before "@input".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            z-prop="value"
            boolean-prop>
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            boolean-prop
            z-prop="value">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "boolean-prop" should go before "z-prop".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-on:click="functionCall"
            v-on:[c]="functionCall">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            v-on:[c]="functionCall"
            v-on:click="functionCall">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "v-on:[c]" should go before "v-on:click".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-text="textContent"
            v-on:click="functionCall">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            v-on:click="functionCall"
            v-text="textContent">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "v-on:click" should go before "v-text".',
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            :class="foo"
            class="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            class="bar"
            :class="foo">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "class" should go before ":class".'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-show="foo"
            v-if="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            v-if="bar"
            v-show="foo">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "v-if" should go before "v-show".'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-foo="foo"
            v-bar="bar">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            v-bar="bar"
            v-foo="foo">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "v-bar" should go before "v-foo".'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template>
          <div
            v-foo.b="b"
            v-foo.a="a">
          </div>
        </template>`,
      options: [{ alphabetical: true }],
      output: `<template>
          <div
            v-foo.a="a"
            v-foo.b="b">
          </div>
        </template>`,
      errors: [
        {
          message: 'Attribute "v-foo.a" should go before "v-foo.b".'
        }
      ]
    },

    {
      filename: 'test.vue',
      code: '<template><div v-cloak v-is="foo"></div></template>',
      output: '<template><div v-is="foo" v-cloak></div></template>',
      errors: [
        {
          message: 'Attribute "v-is" should go before "v-cloak".'
        }
      ]
    },

    // v-bind="..."
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind:id="a"
          v-bind="b"
          v-if="x">
        </div>
      </template>`,
      output: `
      <template>
        <div
          v-if="x"
          v-bind:id="a"
          v-bind="b">
        </div>
      </template>`,
      errors: ['Attribute "v-if" should go before "v-bind:id".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind:id="a"
          v-if="x"
          v-bind="b">
        </div>
      </template>`,
      output: `
      <template>
        <div
          v-if="x"
          v-bind:id="a"
          v-bind="b">
        </div>
      </template>`,
      errors: ['Attribute "v-if" should go before "v-bind:id".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind="b"
          v-bind:id="a"
          v-if="x">
        </div>
      </template>`,
      output: `
      <template>
        <div
          v-bind="b"
          v-if="x"
          v-bind:id="a">
        </div>
      </template>`,
      errors: ['Attribute "v-if" should go before "v-bind:id".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-on:click="x"
          v-bind:id="a"
          v-bind="b">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-bind:id="a"
          v-on:click="x"
          v-bind="b">
        </div>
      </template>`,
      errors: ['Attribute "v-bind:id" should go before "v-on:click".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind:id="a"
          v-on:click="x"
          v-bind="b">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-bind:id="a"
          v-bind="b"
          v-on:click="x">
        </div>
      </template>`,
      errors: ['Attribute "v-bind" should go before "v-on:click".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-on:click="x"
          v-bind="b"
          v-bind:id="a">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-bind="b"
          v-bind:id="a"
          v-on:click="x">
        </div>
      </template>`,
      errors: ['Attribute "v-bind:id" should go before "v-on:click".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-on:click="x"
          v-bind:a="x"
          v-bind="x"
          v-if="x">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-bind:a="x"
          v-on:click="x"
          v-bind="x"
          v-if="x">
        </div>
      </template>`,
      errors: [
        'Attribute "v-bind:a" should go before "v-on:click".',
        'Attribute "v-if" should go before "v-on:click".'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind:a="x"
          v-on:click="x"
          v-bind="x"
          v-if="x">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-bind:a="x"
          v-bind="x"
          v-on:click="x"
          v-if="x">
        </div>
      </template>`,
      errors: [
        'Attribute "v-bind" should go before "v-on:click".',
        'Attribute "v-if" should go before "v-on:click".'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          a="x"
          v-bind="x"
          v-if="x">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-if="x"
          a="x"
          v-bind="x">
        </div>
      </template>`,
      errors: ['Attribute "v-if" should go before "a".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-on:click="x"
          v-bind="x"
          v-if="x">
        </div>
      </template>`,
      options: [{ alphabetical: true }],
      output: `
      <template>
        <div
          v-bind="x"
          v-on:click="x"
          v-if="x">
        </div>
      </template>`,
      errors: [
        'Attribute "v-bind" should go before "v-on:click".',
        'Attribute "v-if" should go before "v-on:click".'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-custom-directive="x"
          v-bind="b"
          v-model="c"
          v-bind:value="a">
        </div>
      </template>`,
      output: `
      <template>
        <div
          v-bind="b"
          v-model="c"
          v-custom-directive="x"
          v-bind:value="a">
        </div>
      </template>`,
      errors: ['Attribute "v-model" should go before "v-custom-directive".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="x"
          v-model="c"
          v-bind="b"
          v-bind:id="a">
        </div>
      </template>`,
      output: `
      <template>
        <div
          v-if="x"
          v-bind="b"
          v-bind:id="a"
          v-model="c">
        </div>
      </template>`,
      errors: ['Attribute "v-bind:id" should go before "v-model".']
    },

    // omit order
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-if="a"
          attr="a"
          v-for="a in items">
        </div>
      </template>`,
      options: [{ order: ['LIST_RENDERING', 'CONDITIONALS'] }],
      output: `
      <template>
        <div
          v-for="a in items"
          v-if="a"
          attr="a">
        </div>
      </template>`,
      errors: ['Attribute "v-for" should go before "v-if".']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          attr="a"
          v-if="a"
          v-for="a in items">
        </div>
      </template>`,
      options: [{ order: ['LIST_RENDERING', 'CONDITIONALS'] }],
      output: `
      <template>
        <div
          attr="a"
          v-for="a in items"
          v-if="a">
        </div>
      </template>`,
      errors: ['Attribute "v-for" should go before "v-if".']
    },

    // slot
    {
      filename: 'test.vue',
      options: [
        {
          order: [
            'UNIQUE',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
            'DEFINITION',
            'SLOT'
          ]
        }
      ],
      code: '<template><div ref="foo" v-slot="{ qux }" bar="baz"></div></template>',
      output:
        '<template><div ref="foo" bar="baz" v-slot="{ qux }"></div></template>',
      errors: [
        {
          message: 'Attribute "bar" should go before "v-slot".'
        }
      ]
    },

    {
      filename: 'test.vue',
      options: [
        {
          order: [
            'UNIQUE',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
            'DEFINITION',
            'SLOT'
          ]
        }
      ],
      code: '<template><div bar="baz" ref="foo" v-slot="{ qux }"></div></template>',
      output:
        '<template><div ref="foo" bar="baz" v-slot="{ qux }"></div></template>',
      errors: [
        {
          message: 'Attribute "ref" should go before "bar".'
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind="object"
          v-if="show"
          v-model="model"
          ref="ref"
          @click="handleClick"/>
      </template>`,
      output: `
      <template>
        <div
          v-if="show"
          v-bind="object"
          ref="ref"
          v-model="model"
          @click="handleClick"/>
      </template>`,
      errors: [
        'Attribute "v-if" should go before "v-bind".',
        'Attribute "ref" should go before "v-model".'
      ]
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          @click="handleClick"
          v-bind="object"/>
      </template>`,
      output: `
      <template>
        <div
          v-bind="object"
          @click="handleClick"/>
      </template>`,
      errors: ['Attribute "v-bind" should go before "@click".']
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          ref="ref"
          @click="handleClick"
          v-bind="object"
          @input="handleInput"/>
      </template>`,
      output: `
      <template>
        <div
          ref="ref"
          v-bind="object"
          @click="handleClick"
          @input="handleInput"/>
      </template>`,
      errors: ['Attribute "v-bind" should go before "@click".']
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          ref="ref"
          @click="handleClick"
          v-bind="object"
          @input="handleInput"/>
      </template>`,
      options: [{ order: ['UNIQUE', 'EVENTS', 'OTHER_ATTR'] }],
      output: `
      <template>
        <div
          ref="ref"
          @click="handleClick"
          @input="handleInput"
          v-bind="object"/>
      </template>`,
      errors: ['Attribute "@input" should go before "v-bind".']
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind="object"
          @click="handleClick"
          attr="foo"/>
      </template>`,
      options: [{ order: ['UNIQUE', 'EVENTS', 'OTHER_ATTR'] }],
      output: `
      <template>
        <div
          @click="handleClick"
          v-bind="object"
          attr="foo"/>
      </template>`,
      errors: ['Attribute "@click" should go before "v-bind".']
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          v-bind:prop-one="a"
          prop-two="b"
          :prop-three="c"/>
      </template>`,
      options: [{ order: ['ATTR_STATIC', 'ATTR_DYNAMIC'] }],
      output: `
      <template>
        <div
          prop-two="b"
          v-bind:prop-one="a"
          :prop-three="c"/>
      </template>`,
      errors: ['Attribute "prop-two" should go before "v-bind:prop-one".']
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          :prop-one="a"
          v-model="value"
          prop-two="b"
          :prop-three="c"
          class="class"
          boolean-prop/>
      </template>`,
      options: [
        {
          order: [
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'ATTR_DYNAMIC',
            'ATTR_STATIC',
            'ATTR_SHORTHAND_BOOL',
            'EVENTS'
          ]
        }
      ],
      output: `
      <template>
        <div
          v-model="value"
          :prop-one="a"
          :prop-three="c"
          prop-two="b"
          class="class"
          boolean-prop/>
      </template>`,
      errors: [
        'Attribute "v-model" should go before ":prop-one".',
        'Attribute ":prop-three" should go before "prop-two".'
      ]
    },

    {
      filename: 'test.vue',
      code: `
      <template>
        <div
          :prop-one="a"
          v-model="value"
          boolean-prop
          prop-two="b"
          :prop-three="c"/>
      </template>`,
      options: [
        {
          order: [
            'UNIQUE',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            ['ATTR_STATIC', 'ATTR_DYNAMIC', 'ATTR_SHORTHAND_BOOL'],
            'EVENTS',
            'CONTENT',
            'DEFINITION',
            'SLOT'
          ]
        }
      ],
      output: `
      <template>
        <div
          v-model="value"
          :prop-one="a"
          boolean-prop
          prop-two="b"
          :prop-three="c"/>
      </template>`,
      errors: ['Attribute "v-model" should go before ":prop-one".']
    }
  ]
})
