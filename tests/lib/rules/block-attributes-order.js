/**
 * @fileoverview enforce ordering of block attributes
 * @author Wenlu Wang
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/block-attributes-order')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})
tester.run('block-attributes-order', rule, {
  valid: [
    {
      filename: 'test-template-without-attributes.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'test-template-with-one-attribute.vue',
      code: '<template functional><div></div></template>'
    },
    {
      filename: 'test-template-attributes.vue',
      code: '<template functional lang="pug" src="./template.html"></template>'
    },
    {
      filename: 'test-script-without-attributes.vue',
      code: '<script></script>'
    },
    {
      filename: 'test-script-with-one-attribute.vue',
      code: '<script lang="ts"></script>'
    },
    {
      filename: 'test-script-attributes.vue',
      code: '<script setup lang="ts" src="./script.js"></script>'
    },
    {
      filename: 'test-style-without-attributes.vue',
      code: '<style></style>'
    },
    {
      filename: 'test-style-with-one-attribute.vue',
      code: '<style lang="less"></style>'
    },
    {
      filename: 'test-style-attributes.vue',
      code: '<style module scoped lang="less" src="./style.css"></style>'
    },
    {
      filename: 'test-custom-block-without-attributes.vue',
      code: '<foobarbaz><foobarbaz>'
    },
    {
      filename: 'test-custom-block-with-one-attribute.vue',
      code: '<foobarbaz foo><foobarbaz>'
    },
    {
      filename: 'test-custom-block-with-attributes.vue',
      code: '<foobarbaz foo bar baz="baz"><foobarbaz>'
    },
    {
      filename: 'test-attributes-with-unknown-attribute.vue',
      code: '<template functional foo lang="pug" src="./template.html"></template>'
    },
    {
      filename: 'test-attributes-options.vue',
      code: '<style module lang="less" scoped src="./style.css"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['module', 'lang', 'scoped', 'src']
          }
        ]
      ]
    },
    {
      filename: 'test-attributes-options-with-unknown-attribute.vue',
      code: '<template functional foo lang="pug" src="./template.html"></template>',
      options: [
        [
          {
            element: 'template',
            order: ['functional', 'foo', 'lang', 'src']
          }
        ]
      ]
    },
    {
      filename: 'test-attributes-options-not-specify-some-attribute-1.vue',
      code: '<style module src="./style.css" lang="less" scoped></style>',
      options: [
        [
          {
            element: 'style',
            order: ['module', 'src', 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test-attributes-options-not-specify-some-attribute-2.vue',
      code: '<style module scoped src="./style.css" lang="less"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['module', 'src', 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test-attributes-options-not-specify-some-attribute-3.vue',
      code: '<style scoped module src="./style.css" lang="less"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['module', 'src', 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test-attributes-options-with-batch-order-1.vue',
      code: '<style module scoped src="./style.css" lang="less"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['module', ['scoped', 'src'], 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test-attributes-options-with-batch-order-2.vue',
      code: '<style module src="./style.css" scoped lang="less"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['module', ['scoped', 'src'], 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test-custom-block-with-attributes-options.vue',
      code: '<foobarbaz foo bar baz="baz"><foobarbaz>',
      options: [
        [
          {
            element: 'foobarbaz',
            order: ['foo', 'bar', 'baz']
          }
        ]
      ]
    },
    {
      filename: 'test-using-element-selector-1.vue',
      code: '<script lang="ts" setup functional></script>',
      options: [
        [
          {
            element: 'script[setup]',
            order: ['lang', 'setup', 'functional']
          }
        ]
      ]
    },
    {
      filename: 'test-using-element-selector-2.vue',
      code: '<script functional lang="ts"></script>',
      options: [
        [
          {
            element: 'script[setup]',
            order: ['lang', 'setup', 'functional']
          },
          {
            element: 'script:not([setup])',
            order: ['functional', 'lang']
          }
        ]
      ]
    },
    {
      filename: 'test-using-regex-order-1.vue',
      code: '<style scoped module lang="less" src="./style.css"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['^(?!(src|lang)$).*', 'lang', 'src']
          }
        ]
      ]
    }
  ],
  invalid: [
    {
      filename: 'test-template-attributes-with-invalid-order.vue',
      code: '<template src="./template.html" lang="pug" functional></template>',
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "lang" should go before "src".'
        },
        {
          type: 'VAttribute',
          message: 'Attribute "functional" should go before "src".'
        }
      ],
      output: '<template lang="pug" src="./template.html" functional></template>'
    },
    {
      filename: 'test-script-attributes-with-invalid-order.vue',
      code: '<script src="./script.js" setup lang="ts"></script>',
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "setup" should go before "src".'
        },
        {
          type: 'VAttribute',
          message: 'Attribute "lang" should go before "src".'
        }
      ],
      output: '<script setup src="./script.js" lang="ts"></script>'
    },
    {
      filename: 'test-style-attributes-with-invalid-order.vue',
      code: '<style src="./style.css" scoped module lang="less"></style>',
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "scoped" should go before "src".'
        },
        {
          type: 'VAttribute',
          message: 'Attribute "module" should go before "src".'
        },
        {
          type: 'VAttribute',
          message: 'Attribute "lang" should go before "src".'
        }
      ],
      output: '<style scoped src="./style.css" module lang="less"></style>'
    },
    {
      filename: 'test-attributes-options-not-default-order.vue',
      code: '<style module scoped src="./style.css" lang="less"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['scoped', 'module', 'src', 'lang']
          }
        ]
      ],
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "scoped" should go before "module".'
        }
      ],
      output: '<style scoped module src="./style.css" lang="less"></style>'
    },
    {
      filename: 'test-custom-block-with-invalid-order.vue',
      code: '<foobarbaz baz="baz" bar foo><foobarbaz>',
      options: [
        [
          {
            element: 'foobarbaz',
            order: ['foo', 'bar', 'baz']
          }
        ]
      ],
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "bar" should go before "baz".'
        },
        {
          type: 'VAttribute',
          message: 'Attribute "foo" should go before "baz".'
        }
      ],
      output: '<foobarbaz bar baz="baz" foo><foobarbaz>'
    },
    {
      filename: 'test-style-attributes-with-batch-order-and-invalid-order.vue',
      code: '<style scoped src="./style.css" lang="less"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['lang', ['src', 'scoped']]
          }
        ]
      ],
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "lang" should go before "src".'
        }
      ],
      output: '<style scoped lang="less" src="./style.css"></style>'
    },
    {
      filename: 'test-using-regex-order-2.vue',
      code: '<style scoped module lang="less" fooo src="./style.css"></style>',
      options: [
        [
          {
            element: 'style',
            order: ['^(?!(src|lang)$).*', 'lang', 'src']
          }
        ]
      ],
      errors: [
        {
          type: 'VAttribute',
          message: 'Attribute "fooo" should go before "lang".'
        }
      ],
      output: '<style scoped module fooo lang="less" src="./style.css"></style>'
    }
  ]
})
