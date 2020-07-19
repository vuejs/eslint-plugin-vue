/**
 * @fileoverview enforce ordering of attributes
 * @author Erin Depew
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/attributes-order')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})
tester.run('attributes-order', rule, {
  valid: [
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
      code:
        '<template><div propone="prop" proptwo="prop" propthree="prop"></div></template>'
    },
    {
      filename: 'test.vue',
      code:
        '<template><div propone="prop" proptwo="prop" is="header"></div></template>',
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
      code:
        '<template><div ref="header" is="header" propone="prop" proptwo="prop"></div></template>',
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
            :class="className"
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
            ['BINDING', 'OTHER_ATTR'],
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
          type: 'VIdentifier'
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
          type: 'VDirectiveKey'
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
          type: 'VDirectiveKey'
        },
        {
          message: 'Attribute ":id" should go before "propOne".',
          type: 'VDirectiveKey'
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
          type: 'VDirectiveKey'
        },
        {
          message: 'Attribute "propOne" should go before "v-on".',
          type: 'VIdentifier'
        }
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div data-id="foo" aria-test="bar" is="custom" myProp="prop"></div></template>',
      output:
        '<template><div data-id="foo" is="custom" aria-test="bar" myProp="prop"></div></template>',
      errors: [
        {
          message: 'Attribute "is" should go before "aria-test".',
          type: 'VIdentifier'
        }
      ]
    },
    {
      filename: 'test.vue',
      code:
        '<template><div ref="header" propone="prop" is="header" ></div></template>',
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
          type: 'VIdentifier'
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
          type: 'VIdentifier'
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
          type: 'VDirectiveKey'
        },
        {
          message: 'Attribute "is" should go before "v-once".',
          type: 'VIdentifier'
        },
        {
          message: 'Attribute "ref" should go before "v-on:click".',
          type: 'VIdentifier'
        },
        {
          message: 'Attribute ":prop" should go before "v-on:click".',
          type: 'VDirectiveKey'
        },
        {
          message: 'Attribute "id" should go before "v-text".',
          type: 'VIdentifier'
        },
        {
          message: 'Attribute "myProp" should go before "v-text".',
          type: 'VIdentifier'
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
          type: 'VIdentifier'
        },
        {
          message: 'Attribute "v-on:click" should go before "v-once".',
          type: 'VDirectiveKey'
        },
        {
          message: 'Attribute "ref" should go before "v-once".',
          type: 'VIdentifier'
        },
        {
          message: 'Attribute "id" should go before "v-text".',
          type: 'VIdentifier'
        },
        {
          message: 'Attribute "myProp" should go before "v-text".',
          type: 'VIdentifier'
        }
      ]
    },
    {
      code: `<template>
            <div
              class="content"
              v-if="!visible"
              :class="className"
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
            ['BINDING', 'OTHER_ATTR'],
            'CONTENT',
            'GLOBAL'
          ]
        }
      ],
      output: `<template>
            <div
              v-if="!visible"
              class="content"
              :class="className"
              v-text="textContent"
              >
            </div>
          </template>`,
      errors: [
        {
          message: 'Attribute "v-if" should go before "class".',
          type: 'VDirectiveKey'
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
          type: 'VDirectiveKey'
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
          type: 'VIdentifier'
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
          type: 'VDirectiveKey'
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
          type: 'VDirectiveKey'
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
          type: 'VIdentifier'
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
          type: 'VDirectiveKey'
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
          type: 'VDirectiveKey'
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
    }
  ]
})
