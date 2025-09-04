/**
 * @fileoverview disallow using deprecated number (keyCodes) modifiers
 * @author yoyo930021
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-v-on-number-modifiers')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-v-on-number-modifiers', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.page-down='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.page-down='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.9='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.9='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.0='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.0='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.4='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.4='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.page-down.native='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.page-down.native='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.0.native='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.0.native='onArrowUp'></template>"
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.34='onArrowUp'></template>",
      output: "<template><input v-on:keyup.page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.34.native='onArrowUp'></template>",
      output:
        "<template><input v-on:keyup.page-down.native='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.unknown.34='onArrowUp'></template>",
      output:
        "<template><input v-on:keyup.unknown.page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 37,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:[dynamicArg].34='onArrowUp'></template>",
      output:
        "<template><input v-on:[dynamicArg].page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:[dynamicArg].unknown.34='onArrowUp'></template>",
      output:
        "<template><input v-on:[dynamicArg].unknown.page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 44,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:[dynamicArg].34.unknown='onArrowUp'></template>",
      output:
        "<template><input v-on:[dynamicArg].page-down.unknown='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.34='onArrowUp'></template>",
      output: "<template><input @keyup.page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.34.native='onArrowUp'></template>",
      output:
        "<template><input @keyup.page-down.native='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.unknown.34='onArrowUp'></template>",
      output:
        "<template><input @keyup.unknown.page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].34='onArrowUp'></template>",
      output:
        "<template><input @[dynamicArg].page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].unknown.34='onArrowUp'></template>",
      output:
        "<template><input @[dynamicArg].unknown.page-down='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].34.unknown='onArrowUp'></template>",
      output:
        "<template><input @[dynamicArg].page-down.unknown='onArrowUp'></template>",
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.10='onArrowUp'></template>",
      output: null,
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.10.native='onArrowUp'></template>",
      output: null,
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.unknown.10='onArrowUp'></template>",
      output: null,
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].unknown.10='onArrowUp'></template>",
      output: null,
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input @keydown.48='onKeydown'>
        <input @keydown.57='onKeydown'>
        <input @keydown.91='onKeydown'>
        <input @keydown.92='onKeydown'>
        <input @keydown.93='onKeydown'>
        <input @keydown.96='onKeydown'>
        <input @keydown.111='onKeydown'>
      </template>`,
      output: null,
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 7,
          column: 25,
          endLine: 7,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 8,
          column: 25,
          endLine: 8,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 9,
          column: 25,
          endLine: 9,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input @keydown.19='onKeydown'>
        <input @keydown.37='onKeydown'>
        <input @keydown.38='onKeydown'>
        <input @keydown.39='onKeydown'>
        <input @keydown.40='onKeydown'>
      </template>`,
      output: `
      <template>
        <input @keydown.pause='onKeydown'>
        <input @keydown.arrow-left='onKeydown'>
        <input @keydown.arrow-up='onKeydown'>
        <input @keydown.arrow-right='onKeydown'>
        <input @keydown.arrow-down='onKeydown'>
      </template>`,
      errors: [
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 27
        },
        {
          message:
            "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead.",
          line: 7,
          column: 25,
          endLine: 7,
          endColumn: 27
        }
      ]
    }
  ]
})
