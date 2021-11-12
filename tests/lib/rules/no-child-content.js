/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-child-content')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-child-content', rule, {
  valid: [
    {
      // element without directive
      filename: 'test.vue',
      code: '<template><div>foo</div></template>'
    },
    {
      // element with unknown directive
      filename: 'test.vue',
      code: '<template><div v-foo="bar" /></template>'
    },
    {
      // self-closing element with v-html directive
      filename: 'test.vue',
      code: '<template><div v-html="foo" /></template>'
    },
    {
      // self-closing element with v-text directive
      filename: 'test.vue',
      code: '<template><div v-text="foo" /></template>'
    },
    {
      // empty element with v-html directive
      filename: 'test.vue',
      code: '<template><div v-html="foo"></div></template>'
    },
    {
      // self-closing element with v-t directive
      filename: 'test.vue',
      options: [{ additionalDirectives: ['t'] }],
      code: '<template><div v-t="foo" /></template>'
    }
  ],
  invalid: [
    {
      // v-html directive and text content
      filename: 'test.vue',
      code: '<template><div v-html="foo">bar</div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 29,
          endColumn: 32,
          suggestions: [
            { output: '<template><div v-html="foo"></div></template>' }
          ]
        }
      ]
    },
    {
      // v-html directive and whitespace-only text content
      filename: 'test.vue',
      code: '<template><div v-html="foo"> </div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 29,
          endColumn: 30,
          suggestions: [
            { output: '<template><div v-html="foo"></div></template>' }
          ]
        }
      ]
    },
    {
      // v-html directive and text expression content
      filename: 'test.vue',
      code: '<template><div v-html="foo">{{ bar }}</div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 29,
          endColumn: 38,
          suggestions: [
            { output: '<template><div v-html="foo"></div></template>' }
          ]
        }
      ]
    },
    {
      // v-html directive and child element
      filename: 'test.vue',
      code: '<template><div v-html="foo"><span /></div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 29,
          endColumn: 37,
          suggestions: [
            { output: '<template><div v-html="foo"></div></template>' }
          ]
        }
      ]
    },
    {
      // v-text directive and text content
      filename: 'test.vue',
      code: '<template><div v-text="foo">bar</div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-text directive.',
          column: 29,
          endColumn: 32,
          suggestions: [
            { output: '<template><div v-text="foo"></div></template>' }
          ]
        }
      ]
    },
    {
      // v-t directive and text content
      filename: 'test.vue',
      options: [{ additionalDirectives: ['t'] }],
      code: '<template><div v-t="foo">bar</div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-t directive.',
          column: 26,
          endColumn: 29,
          suggestions: [
            { output: '<template><div v-t="foo"></div></template>' }
          ]
        }
      ]
    },
    {
      // v-html directive and text content while v-t directive is configured
      filename: 'test.vue',
      options: [{ additionalDirectives: ['t'] }],
      code: '<template><div v-html="foo">baz</div></template>',
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 29,
          endColumn: 32,
          suggestions: [
            { output: '<template><div v-html="foo"></div></template>' }
          ]
        }
      ]
    }
  ]
})
