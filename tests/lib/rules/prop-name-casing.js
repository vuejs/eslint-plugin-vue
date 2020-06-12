/**
 * @fileoverview Define a style for the name property casing for consistency purposes
 * @author Yu Kimura
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prop-name-casing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('prop-name-casing', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['greetingText']
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: some_props
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            ...some_props,
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['greetingText']
        }
      `,
      options: ['camelCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['greeting_text']
        }
      `,
      options: ['snake_case'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            greetingText: String
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: {
          greetingText: String
        }
      }
      `,
      options: ['camelCase'],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: {
          greeting_text: String
        }
      }
      `,
      options: ['snake_case'],
      parserOptions
    },
    {
      // computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            ['greetingText']: String
          }
        }
      `,
      parserOptions
    },
    {
      // computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [('greetingText')]: String
          }
        }
      `,
      parserOptions
    },
    {
      // TemplateLiteral computed property does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [\`greeting\${'-'}text\`]: String
          }
        }
      `,
      parserOptions
    },
    {
      // shorthand
      filename: 'test.vue',
      code: `
        export default {
          props: {
            greetingText
          }
        }
      `,
      parserOptions
    },
    {
      // valiable computed property name does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [greeting_text]: String
          }
        }
      `,
      parserOptions
    },
    {
      // valiable computed property name does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [greeting.text]: String
          }
        }
      `,
      parserOptions
    },
    {
      // BinaryExpression computed property name does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            ['greeting'+'-text']: String
          }
        }
      `,
      parserOptions
    },
    {
      // CallExpression computed property name does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [greeting_text()]: String
          }
        }
      `,
      parserOptions
    },
    {
      // ThisExpression computed property name does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [this]: String
          }
        }
      `,
      parserOptions
    },
    {
      // ArrayExpression computed property name does not warn
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [['greeting-text']]: String
          }
        }
      `,
      parserOptions
    },
    {
      // number Literal computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [1]: String
          }
        }
      `,
      parserOptions
    },
    {
      // boolean Literal computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [true]: String
          }
        }
      `,
      parserOptions
    },
    {
      // null Literal computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [null]: String
          }
        }
      `,
      parserOptions
    },
    {
      // Japanese characters
      filename: 'test.vue',
      code: `
        export default {
          props: {
            '漢字': String
          }
        }
      `,
      parserOptions
    },
    {
      // emoji
      filename: 'test.vue',
      code: `
        export default {
          props: {
            '\u{1F37B}': String
          }
        }
      `,
      parserOptions
    },
    {
      // #862
      filename: 'test.vue',
      code: `
        export default {
          props: {
            $actionEl: String
          }
        }
      `,
      parserOptions
    },
    {
      // #932
      filename: 'test.vue',
      code: `
        export default {
          props: {
            $css: String
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            _item: String
          }
        }
      `,
      options: ['snake_case'],
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            greeting_text: String
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            greeting_text: String
          }
        }
      `,
      options: ['camelCase'],
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['greeting_text']
        }
      `,
      options: ['camelCase'],
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          type: 'Literal',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            greetingText: String
          }
        }
      `,
      options: ['snake_case'],
      parserOptions,
      errors: [
        {
          message: 'Prop "greetingText" is not in snake_case.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            'greeting-text': String
          }
        }
      `,
      options: ['camelCase'],
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting-text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            'greeting-text': String
          }
        }
      `,
      options: ['snake_case'],
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting-text" is not in snake_case.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            'greeting_text': String
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      // computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            ['greeting-text']: String
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting-text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      // shorthand
      filename: 'test.vue',
      code: `
        export default {
          props: {
            greeting_text
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            'abc-123-def': String
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Prop "abc-123-def" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      // Parentheses computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [('greeting-text')]: String
          }
        }
      `,
      parserOptions,
      errors: [
        {
          message: 'Prop "greeting-text" is not in camelCase.',
          type: 'Property',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            _item: String
          }
        }
      `,
      parserOptions,
      errors: ['Prop "_item" is not in camelCase.']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            _itemName: String
          }
        }
      `,
      options: ['snake_case'],
      parserOptions,
      errors: ['Prop "_itemName" is not in snake_case.']
    },
    {
      // TemplateLiteral computed property
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [\`greeting-text\`]: String
          }
        }
      `,
      parserOptions,
      errors: ['Prop "greeting-text" is not in camelCase.']
    },
    {
      // RegExp Literal computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [/greeting-text/]: String
          }
        }
      `,
      parserOptions,
      errors: ['Prop "/greeting-text/" is not in camelCase.']
    }
  ]
})
