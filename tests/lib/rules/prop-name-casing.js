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
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: { experimentalObjectRestSpread: true }
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
          props: ['greetingText']
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
      output: `
        export default {
          props: {
            greetingText: String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "greeting_text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: `
        export default {
          props: {
            greetingText: String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "greeting_text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: `
        export default {
          props: {
            greeting_text: String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "greetingText" is not in snake_case.',
        type: 'Property',
        line: 4
      }]
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
      output: `
        export default {
          props: {
            'greetingText': String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "greeting-text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: `
        export default {
          props: {
            'greeting_text': String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "greeting-text" is not in snake_case.',
        type: 'Property',
        line: 4
      }]
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
      output: `
        export default {
          props: {
            'greetingText': String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "greeting_text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: null,
      parserOptions,
      errors: [{
        message: 'Prop "greeting-text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: null,
      parserOptions,
      errors: [{
        message: 'Prop "greeting_text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
    },
    {
      // valiable computed property name
      filename: 'test.vue',
      code: `
        export default {
          props: {
            [greeting_text]: String
          }
        }
      `,
      output: null,
      parserOptions,
      errors: [{
        // bug ?
        message: 'Prop "greeting_text" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: null,
      parserOptions,
      errors: [{
        message: 'Prop "\u{1F37B}" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: null,
      parserOptions,
      errors: [{
        message: 'Prop "漢字" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
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
      output: `
        export default {
          props: {
            'abc123Def': String
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Prop "abc-123-def" is not in camelCase.',
        type: 'Property',
        line: 4
      }]
    }
  ]
})
