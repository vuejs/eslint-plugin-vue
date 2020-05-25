/**
 * @author Yosuke ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/html-comment-content-newline')

const RuleTester = require('eslint').RuleTester

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
})
tester.run('html-comment-content-newline', rule, {
  valid: [
    {
      code: `
        <template>
          <!-- comment -->
          <!--
            multiline
            comment
          -->
        </template>
        `
    },
    {
      code: `
        <template>
          <!--
            comment
          -->
          <!--
            multiline
            comment
          -->
          <!--

            multiline
            comment

          -->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!-- comment -->
          <!-- multiline
            comment -->
        </template>
        `,
      options: ['never']
    },
    {
      code: `
        <template>
          <!---->
          <!--
          -->
          <!--

          -->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!---->
          <!--
          -->
          <!--

          -->
        </template>
        `,
      options: ['never']
    },
    {
      code: `
        <template>
          <!--
            comment
          -->
          <!-- multiline
            comment -->
        </template>
        `,
      options: [{ singleline: 'always', multiline: 'never' }]
    },
    {
      code: `
        <template>
          <!--comment-->
          <!-- comment -->
          <!--\tcomment\t-->
          <!--    comment    -->
        </template>
        `,
      options: ['never']
    },
    // ignore
    {
      code: `
        <template>
          <!-- comment -->
          <!--
            comment
          -->
          <!-- multiline
            comment -->
          <!--
            multiline
            comment
          -->
        </template>
        `,
      options: [{ singleline: 'ignore', multiline: 'ignore' }]
    },

    // exceptions
    {
      code: `
        <template>
          <!--++++++++++++++++
            comment
          ++++++++++++++++-->
        </template>
        `,
      options: ['always', { exceptions: ['+'] }]
    },
    {
      code: `
        <template>
          <!--+-++-++-++-++-++-+
            comment
          +-++-++-++-++-++-+-->
        </template>
        `,
      options: ['always', { exceptions: ['+-+'] }]
    },
    {
      code: `
        <template>
          <!--++++++++++++++++-->
        </template>
        `,
      options: ['always', { exceptions: ['+'] }]
    },
    {
      code: `
        <template>
          <!--++++
            comment
          ++++-->
          <!--****
            comment
          ****-->
          <!--++xx
            comment
          ++xx-->
        </template>
        `,
      options: ['always', { exceptions: ['+', '*', '++xx'] }]
    },
    {
      code: `
        <template>
          <!--++++++++++++++++ comment ++++++++++++++++-->
        </template>
        `,
      options: ['never', { exceptions: ['+'] }]
    },

    // directive
    {
      code: `
        <template>
          <!-- eslint-disable -->
          <!-- eslint-enable -->
          <!-- eslint-disable-line-->
          <!-- eslint-disable-next-line -->
          <!-- eslint-disable xxx -->
          <!-- eslint-enable  xxx -->
          <!-- eslint-disable-line xxx-->
          <!-- eslint-disable-next-line xxx -->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!--
            eslint-disable
          -->
        </template>
        `,
      options: ['never']
    },
    // invalid html
    {
      code: `
        <template>
          <!-- comment
        </template>
        `,
      options: ['always']
    },

    // IE conditional comments
    {
      code: `
        <template>
          <!--[if IE 8]>
          <div>IE8 only</div>
          <![endif]-->
        </template>
        `
    },
    {
      code: `
        <template>
          <!--[if !IE]><!-->
          <div>not IE only</div>
          <!--<![endif]-->
        </template>
        `
    }
  ],

  invalid: [
    {
      code: `
        <template>
          <!--
            comment
          -->
          <!-- multiline
            comment -->
        </template>
        `,
      output: `
        <template>
          <!-- comment -->
          <!--\n multiline
            comment \n-->
        </template>
        `,
      errors: [
        {
          message: "Unexpected line breaks after '<!--'.",
          line: 3,
          column: 15,
          endLine: 4,
          endColumn: 13
        },
        {
          message: "Unexpected line breaks before '-->'.",
          line: 4,
          column: 20,
          endLine: 5,
          endColumn: 11
        },
        {
          message: "Expected line break after '<!--'.",
          line: 6,
          column: 15,
          endColumn: 16
        },
        {
          message: "Expected line break before '-->'.",
          line: 7,
          column: 20,
          endColumn: 21
        }
      ]
    },
    {
      code: `
        <template>
          <!--comment-->
          <!--  comment  -->
        </template>
        `,
      options: ['always'],
      output: `
        <template>
          <!--\ncomment\n-->
          <!--\n  comment  \n-->
        </template>
        `,
      errors: [
        {
          message: "Expected line break after '<!--'.",
          line: 3,
          column: 15,
          endColumn: 15
        },
        {
          message: "Expected line break before '-->'.",
          line: 3,
          column: 22,
          endColumn: 22
        },
        {
          message: "Expected line break after '<!--'.",
          line: 4,
          column: 15,
          endColumn: 17
        },
        {
          message: "Expected line break before '-->'.",
          line: 4,
          column: 24,
          endColumn: 26
        }
      ]
    },
    {
      code: `
        <template>
          <!--
comment
-->
        </template>
        `,
      options: ['never'],
      output: `
        <template>
          <!-- comment -->
        </template>
        `,
      errors: [
        {
          message: "Unexpected line breaks after '<!--'.",
          line: 3,
          column: 15,
          endLine: 4,
          endColumn: 1
        },
        {
          message: "Unexpected line breaks before '-->'.",
          line: 4,
          column: 8,
          endLine: 5,
          endColumn: 1
        }
      ]
    },
    {
      code: `
        <template>
          <!-- \t \t  \t\tcomment \t \t  \t\t-->
        </template>
        `,
      options: ['always'],
      output: `
        <template>
          <!--\n \t \t  \t\tcomment \t \t  \t\t\n-->
        </template>
        `,
      errors: [
        {
          message: "Expected line break after '<!--'.",
          line: 3,
          column: 15,
          endColumn: 23
        },
        {
          message: "Expected line break before '-->'.",
          line: 3,
          column: 30,
          endColumn: 38
        }
      ]
    },
    // exceptions
    {
      code: `
        <template>
          <!--++++++++++++++++comment++++++++++++++++-->
        </template>
        `,
      options: ['always', { exceptions: ['+'] }],
      output: null,
      errors: [
        'Expected line break after exception block.',
        'Expected line break before exception block.'
      ]
    },
    {
      code: `
        <template>
          <!--*****comment**-->
        </template>
        `,
      options: ['always', { exceptions: ['*'] }],
      output: null,
      errors: [
        'Expected line break after exception block.',
        'Expected line break before exception block.'
      ]
    },
    {
      code: `
        <template>
          <!--#+#-#+#-#+#-comment #+#-->
        </template>
        `,
      options: ['always', { exceptions: ['#+#-'] }],
      output: `
        <template>
          <!--#+#-#+#-#+#-comment #+#\n-->
        </template>
        `,
      errors: [
        'Expected line break after exception block.',
        "Expected line break before '-->'."
      ]
    },
    {
      code: `
        <template>
          <!--*****comment++++-->
        </template>
        `,
      options: ['always', { exceptions: ['*', '++'] }],
      output: null,
      errors: [
        'Expected line break after exception block.',
        {
          message: 'Expected line break before exception block.',
          line: 3,
          column: 27
        }
      ]
    },
    {
      code: `
        <template>
          <!--*****comment+++++-->
        </template>
        `,
      options: ['always', { exceptions: ['*', '++'] }],
      output: null,
      errors: [
        'Expected line break after exception block.',
        {
          message: 'Expected line break before exception block.',
          line: 3,
          column: 28
        }
      ]
    }
  ]
})
