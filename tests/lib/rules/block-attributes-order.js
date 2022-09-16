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
      code: `<template><div></div><template>`
    },
    {
      filename: 'test-template-with-one-attribute.vue',
      code: `<template functional><div></div><template>`
    },
    {
      filename: 'test-template-attributes.vue',
      code: `<template functional lang="pug" src="./template.html"><template>`
    },
    {
      filename: 'test-script-without-attributes.vue',
      code: `<script></script>`
    },
    {
      filename: 'test-script-with-one-attribute.vue',
      code: `<script lang="ts"></script>`
    },
    {
      filename: 'test-script-attributes.vue',
      code: `<script lang="ts" setup src="./script.js"></script>`
    },
    {
      filename: 'test-style-without-attributes.vue',
      code: `<style><style>`
    },
    {
      filename: 'test-style-with-one-attribute.vue',
      code: `<style lang="less"><style>`
    },
    {
      filename: 'test-style-attributes.vue',
      code: `<style lang="less" module scoped src="./style.css"><style>`
    },
    {
      filename: 'test-custom-block-without-attributes.vue',
      code: `<foobarbaz><foobarbaz>`
    },
    {
      filename: 'test-custom-block-with-one-attribute.vue',
      code: `<foobarbaz foo><foobarbaz>`
    },
    {
      filename: 'test-custom-block-with-attributes.vue',
      code: `<foobarbaz foo bar baz="baz"><foobarbaz>`
    },
    {
      filename: 'test-attributes-with-unknown-attribute.vue',
      code: `<template functional foo lang="pug" src="./template.html"><template>`
    },
    {
      filename: 'test-attributes-options.vue',
      code: `<style module scoped src="./style.css" lang="less"><style>`,
      options: [
        {
          order: {
            style: ['module', 'scoped', 'src', 'lang']
          }
        }
      ]
    },
    {
      filename: 'test-attributes-options-with-unknown-attribute.vue',
      code: `<template functional foo lang="pug" src="./template.html"><template>`,
      options: [
        {
          order: {
            template: ['functional', 'foo', 'lang', 'src']
          }
        }
      ]
    },
    {
      filename: 'test-attributes-options-not-specify-some-attribute-1.vue',
      code: `<style module src="./style.css" lang="less" scoped><style>`,
      options: [
        {
          order: {
            style: ['module', 'src', 'lang']
          }
        }
      ]
    },
    {
      filename: 'test-attributes-options-not-specify-some-attribute-2.vue',
      code: `<style module scoped src="./style.css" lang="less"><style>`,
      options: [
        {
          order: {
            style: ['module', 'src', 'lang']
          }
        }
      ]
    },
    {
      filename: 'test-attributes-options-not-specify-some-attribute-3.vue',
      code: `<style scoped module src="./style.css" lang="less"><style>`,
      options: [
        {
          order: {
            style: ['module', 'src', 'lang']
          }
        }
      ]
    },
    {
      filename: 'test-attributes-options-with-batch-order-1.vue',
      code: `<style module scoped src="./style.css" lang="less"><style>`,
      options: [
        {
          order: {
            style: ['module', ['scoped', 'src'], 'lang']
          }
        }
      ]
    },
    {
      filename: 'test-attributes-options-with-batch-order-2.vue',
      code: `<style module src="./style.css" scoped lang="less"><style>`,
      options: [
        {
          order: {
            style: ['module', ['scoped', 'src'], 'lang']
          }
        }
      ]
    },
    {
      filename: 'test-custom-block-with-attributes-options.vue',
      code: `<foobarbaz foo bar baz="baz"><foobarbaz>`,
      options: [
        {
          order: {
            foobarbaz: ['foo', 'bar', 'baz']
          }
        }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test-template-attributes-with-invalid-order.vue',
      code: '<template src="./template.html" lang="pug" functional><template>',
      errors: [
        {
          type: 'VAttribute',
          message: `Attribute "lang" should go before "src".`
        },
        {
          type: 'VAttribute',
          message: `Attribute "functional" should go before "src".`
        }
      ],
      output: `<template lang="pug" src="./template.html" functional><template>`
    },
    {
      filename: 'test-script-attributes-with-invalid-order.vue',
      code: `<script src="./script.js" setup lang="ts"></script>`,
      errors: [
        {
          type: 'VAttribute',
          message: `Attribute "setup" should go before "src".`
        },
        {
          type: 'VAttribute',
          message: `Attribute "lang" should go before "src".`
        }
      ],
      output: `<script setup src="./script.js" lang="ts"></script>`
    },
    {
      filename: 'test-style-attributes-with-invalid-order.vue',
      code: `<style src="./style.css" scoped module lang="less"><style>`,
      errors: [
        {
          type: 'VAttribute',
          message: `Attribute "scoped" should go before "src".`
        },
        {
          type: 'VAttribute',
          message: `Attribute "module" should go before "src".`
        },
        {
          type: 'VAttribute',
          message: `Attribute "lang" should go before "src".`
        }
      ],
      output: `<style scoped src="./style.css" module lang="less"><style>`
    },
    {
      filename: 'test-attributes-options-not-default-order.vue',
      code: `<style module scoped src="./style.css" lang="less"><style>`,
      options: [
        {
          order: {
            style: ['scoped', 'module', 'src', 'lang']
          }
        }
      ],
      errors: [
        {
          type: 'VAttribute',
          message: `Attribute "scoped" should go before "module".`
        }
      ],
      output: `<style scoped module src="./style.css" lang="less"><style>`
    },
    {
      filename: 'test-custom-block-with-invalid-order.vue',
      code: `<foobarbaz baz="baz" bar foo><foobarbaz>`,
      options: [
        {
          order: {
            foobarbaz: ['foo', 'bar', 'baz']
          }
        }
      ],
      errors: [
        {
          type: 'VAttribute',
          message: `Attribute "bar" should go before "baz".`
        },
        {
          type: 'VAttribute',
          message: `Attribute "foo" should go before "baz".`
        }
      ],
      output: `<foobarbaz bar baz="baz" foo><foobarbaz>`
    },
    {
      filename: 'test-style-attributes-with-batch-order-and-invalid-order.vue',
      code: `<style scoped src="./style.css" lang="less"><style>`,
      options: [
        {
          order: {
            style: ['lang', ['src', 'scoped']]
          }
        }
      ],
      errors: [
        {
          type: 'VAttribute',
          message: `Attribute "lang" should go before "src".`
        }
      ],
      output: `<style scoped lang="less" src="./style.css"><style>`
    }
  ]
})
