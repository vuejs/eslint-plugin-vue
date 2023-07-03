/**
 * @fileoverview Define a style for the props casing in templates.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/attribute-hyphenation')

const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('attribute-hyphenation', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom data-id="foo" aria-test="bar" slot-scope="{ data }" my-prop="prop"></custom></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom data-id="foo" aria-test="bar" slot-scope="{ data }" myProp="prop"></custom></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div data-id="foo" aria-test="bar" slot-scope="{ data }"><a onClick="" my-prop="prop"></a></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><custom data-id="foo" aria-test="bar" slot-scope="{ data }" custom-hyphen="foo" second-custom="bar"><a onClick="" my-prop="prop"></a></custom></template>',
      options: ['never', { ignore: ['custom-hyphen', 'second-custom'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><my-component :[fooBar]></my-component></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><my-component :[foo-bar]></my-component></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot my-prop></slot></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot myProp></slot></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :attr_ff="prop"></custom></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :attr_ff="prop"></custom></div></template>',
      options: ['never']
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><custom my-prop="foo"></custom></div></template>',
      output: '<template><div><custom myProp="foo"></custom></div></template>',
      options: ['never'],
      errors: [
        {
          message: "Attribute 'my-prop' can't be hyphenated.",
          type: 'VIdentifier',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom MyProp="Bar"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute 'MyProp' must be hyphenated.",
          type: 'VIdentifier',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :my-prop="prop"></custom></div></template>',
      output:
        '<template><div><custom :myProp="prop"></custom></div></template>',
      options: ['never'],
      errors: [
        {
          message: "Attribute ':my-prop' can't be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :MyProp="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute ':MyProp' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom v-bind:my-prop="prop"></custom></div></template>',
      output:
        '<template><div><custom v-bind:myProp="prop"></custom></div></template>',
      options: ['never'],
      errors: [
        {
          message: "Attribute 'v-bind:my-prop' can't be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom v-bind:MyProp="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute 'v-bind:MyProp' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom v-bind:MyProp="prop"></custom></div></template>',
      output: null,
      options: ['always', { ignore: [] }],
      errors: [
        {
          message: "Attribute 'v-bind:MyProp' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom v-bind:my-prop="prop" :second-prop="test"></custom></div></template>',
      output:
        '<template><div><custom v-bind:my-prop="prop" :secondProp="test"></custom></div></template>',
      options: ['never', { ignore: ['my-prop'] }],
      errors: [
        {
          message: "Attribute ':second-prop' can't be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom v-bind:myProp="prop" :secondProp="test"></custom></div></template>',
      output:
        '<template><div><custom v-bind:my-prop="prop" :secondProp="test"></custom></div></template>',
      options: ['always', { ignore: ['secondProp'] }],
      errors: [
        {
          message: "Attribute 'v-bind:myProp' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom v-bind:propID="prop" :secondPropID="test"></custom></div></template>',
      output:
        '<template><div><custom v-bind:prop-i-d="prop" :secondPropID="test"></custom></div></template>',
      options: ['always', { ignore: ['secondPropID'] }],
      errors: [
        {
          message: "Attribute 'v-bind:propID' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom data-id="foo" aria-test="bar" slot-scope="{ data }" custom-hyphen="foo" second-custom="baz" third-custom="bar">
            <a onClick="" my-prop="prop"></a>
          </custom>
        </template>
      `,
      output: `
        <template>
          <custom data-id="foo" aria-test="bar" slot-scope="{ data }" custom-hyphen="foo" second-custom="baz" thirdCustom="bar">
            <a onClick="" my-prop="prop"></a>
          </custom>
        </template>
      `,
      options: ['never', { ignore: ['custom-hyphen', 'second-custom'] }],
      errors: [
        {
          message: "Attribute 'third-custom' can't be hyphenated.",
          type: 'VIdentifier',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <custom data-id="foo" aria-test="bar" slot-scope="{ data }" custom-hyphen="foo" second-custom="baz" thirdCustom="bar">
            <a onClick="" my-prop="prop"></a>
          </custom>
        </template>
      `,
      output: `
        <template>
          <custom data-id="foo" aria-test="bar" slot-scope="{ data }" customHyphen="foo" secondCustom="baz" thirdCustom="bar">
            <a onClick="" my-prop="prop"></a>
          </custom>
        </template>
      `,
      options: ['never'],
      errors: [
        {
          message: "Attribute 'custom-hyphen' can't be hyphenated.",
          type: 'VIdentifier',
          line: 3
        },
        {
          message: "Attribute 'second-custom' can't be hyphenated.",
          type: 'VIdentifier',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot my-prop="foo"></slot></div></template>',
      output: '<template><div><slot myProp="foo"></slot></div></template>',
      options: ['never'],
      errors: [
        {
          message: "Attribute 'my-prop' can't be hyphenated.",
          type: 'VIdentifier',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><slot MyProp="Bar"></slot></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute 'MyProp' must be hyphenated.",
          type: 'VIdentifier',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :attr_Gg="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute ':attr_Gg' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :Attr_Hh="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute ':Attr_Hh' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :_attr_Jj="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute ':_attr_Jj' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :_attrKk="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute ':_attrKk' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :_AttrLl="prop"></custom></div></template>',
      output: null,
      options: ['always'],
      errors: [
        {
          message: "Attribute ':_AttrLl' must be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><custom :my-custom_prop="prop"></custom></div></template>',
      output: null,
      options: ['never'],
      errors: [
        {
          message: "Attribute ':my-custom_prop' can't be hyphenated.",
          type: 'VDirectiveKey',
          line: 1
        }
      ]
    }
  ]
})
