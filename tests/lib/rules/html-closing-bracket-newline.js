/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-closing-bracket-newline')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('html-closing-bracket-newline', rule, {
  valid: [
    `<template><div></div></template>`,
    `
      <template>
        <div
          id=""
        >
        </div>
      </template>
    `,
    {
      code: `<template><div></div></template>`,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id=""
            >
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ]
    },
    {
      code: `
        <template>
          <div id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ]
    },
    {
      code: `
        <template
        >
          <div
            id="">
          </div
          >
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template
        >
          <div id=""
          >
          </div
          >
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ]
    },

    // Ignore if no closing brackets
    `
      <template>
        <div
          id=
          ""
    `
  ],
  invalid: [
    {
      code: `
        <template>
          <div
          ></div

          >
        </template>
      `,
      output: `
        <template>
          <div></div>
        </template>
      `,
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected no line breaks before closing bracket, but 2 line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id=""
>
          </div>
        </template>
      `,
      errors: [
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
          ></div

          >
        </template>
      `,
      output: `
        <template>
          <div></div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected no line breaks before closing bracket, but 2 line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
            id=""
            >
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.'
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id=""
>
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      errors: [
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div id=""
          >
          </div
          >
        </template>
      `,
      output: `
        <template>
          <div id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected no line breaks before closing bracket, but 1 line break found.'
      ]
    },
    {
      code: `
        <template
        >
          <div
            id=""
            >
          </div>
        </template
        >
      `,
      output: `
        <template
        >
          <div
            id="">
          </div
>
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ],
      errors: [
        'Expected no line breaks before closing bracket, but 1 line break found.',
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template
        >
          <div id="">
          </div>
        </template
        >
      `,
      output: `
        <template
        >
          <div id=""
>
          </div
>
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ],
      errors: [
        'Expected 1 line break before closing bracket, but no line breaks found.',
        'Expected 1 line break before closing bracket, but no line breaks found.'
      ]
    },
    {
      code: `
        <template
        >
        </template
        >
        <script
        >
        </script
        >
        <style
        ></style
        >
      `,
      output: `
        <template>
        </template>
        <script>
        </script>
        <style></style>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 2,
          column: 18,
          endLine: 3,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 4,
          column: 19,
          endLine: 5,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 6,
          column: 16,
          endLine: 7,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 8,
          column: 17,
          endLine: 9,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 10,
          column: 15,
          endLine: 11,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 11,
          column: 17,
          endLine: 12,
          endColumn: 9
        }
      ]
    },
    {
      code: `
        <template>
        </template>
        <script>
        </script>
        <style></style>
      `,
      output: `
        <template
>
        </template
>
        <script
>
        </script
>
        <style
></style
>
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'always'
        }
      ],
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 2,
          column: 18,
          endColumn: 18
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 3,
          column: 19,
          endColumn: 19
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 4,
          column: 16,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 5,
          column: 17,
          endColumn: 17
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 6,
          column: 15,
          endColumn: 15
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 6,
          column: 23,
          endColumn: 23
        }
      ]
    }
  ]
})
