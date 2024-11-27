/**
 * @fileoverview Define a style for the name property casing for consistency purposes
 * @author Yu Kimura
 */
'use strict'

const semver = require('semver')
const rule = require('../../../lib/rules/prop-name-casing')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
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
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: some_props
        }
      `,
      languageOptions
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
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['greetingText']
        }
      `,
      options: ['camelCase'],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['greeting_text']
        }
      `,
      options: ['snake_case'],
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
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
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        greetingText: String
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['greetingText'])
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        greetingText: number
      }
      defineProps<Props>()
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
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
      languageOptions,
      errors: ['Prop "/greeting-text/" is not in camelCase.']
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        greeting_text: String
      })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['greeting_text'])
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ...languageOptions
      },
      errors: [
        {
          message: 'Prop "greeting_text" is not in camelCase.',
          line: 3
        }
      ]
    },
    ...(semver.lt(
      require('@typescript-eslint/parser/package.json').version,
      '4.0.0'
    )
      ? []
      : [
          {
            filename: 'test.vue',
            code: `
            <script setup lang="ts">
            interface Props {
              greeting_text: number
            }
            defineProps<Props>()
            </script>
            `,
            languageOptions: {
              parser: require('vue-eslint-parser'),
              ...languageOptions,
              parserOptions: {
                parser: require.resolve('@typescript-eslint/parser')
              }
            },
            errors: [
              {
                message: 'Prop "greeting_text" is not in camelCase.',
                line: 4
              }
            ]
          }
        ])
  ]
})
