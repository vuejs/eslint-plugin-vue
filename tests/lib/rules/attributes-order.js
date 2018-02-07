/**
 * @fileoverview enforce ordering of attributes
 * @author Erin Depew
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/attributes-order')
var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var tester = new RuleTester({
  parser: 'vue-eslint-parser',
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
      code:
      `<template>
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
      code:
      `<template>
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
      code:
        `<template>
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
      code:
        `<template>
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
      code:
        `<template>
          <div
            v-for="item in items"
            v-if="!visible"
            propone="prop"
            proptwo="prop"
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
        { order:
          ['LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'BINDING',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
            'DEFINITION']
        }]
    },
    {
      filename: 'test.vue',
      code: '<template><div ref="header" is="header" propone="prop" proptwo="prop"></div></template>',
      options: [
        { order:
          ['LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'BINDING',
            'DEFINITION',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT']
        }]
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-cloak is="header"></div></template>',
      errors: [{
        message: 'Attribute "is" should go before "v-cloak".',
        type: 'VIdentifier'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div id="uniqueID" v-cloak></div></template>',
      errors: [{
        message: 'Attribute "v-cloak" should go before "id".',
        type: 'VDirectiveKey'
      }]
    },
    {
      filename: 'test.vue',
      code:
        `<template>
          <div
            model="baz"
            v-model="toggle"
            propOne="bar"
            :bindingProp="foo">
          </div>
        </template>`,
      errors: [{
        message: 'Attribute "v-model" should go before "model".',
        type: 'VDirectiveKey'
      },
      {
        message: 'Attribute ":bindingProp" should go before "propOne".',
        type: 'VDirectiveKey'
      }]
    },
    {
      filename: 'test.vue',
      code:
        `<template>
          <div
            :bindingProp="foo"
            model="baz"
            v-on="functionCall"
            v-model="toggle"
            propOne="bar">
          </div>
        </template>`,
      errors: [{
        message: 'Attribute "v-model" should go before "v-on".',
        type: 'VDirectiveKey'
      },
      {
        message: 'Attribute "propOne" should go before "v-on".',
        type: 'VIdentifier'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div data-id="foo" aria-test="bar" is="custom" myProp="prop"></div></template>',
      errors: [{
        message: 'Attribute "is" should go before "aria-test".',
        type: 'VIdentifier'
      }]
    },
    {
      filename: 'test.vue',
      code: '<template><div ref="header" propone="prop" is="header" ></div></template>',
      options: [
        { order:
          ['LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'BINDING',
            'DEFINITION',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT']
        }],
      errors: [{
        message: 'Attribute "is" should go before "propone".',
        type: 'VIdentifier'
      }]
    }
  ]
})
