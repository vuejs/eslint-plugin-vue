/**
 * @author Yosuke ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/html-comment-content-spacing')

const RuleTester = require('../../eslint-compat').RuleTester

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})
tester.run('html-comment-content-spacing', rule, {
  valid: [
    `
      <template>
        <!-- comment -->
      </template>
    `,
    {
      code: `
        <template>
          <!--
            comment
          -->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!--\tcomment\t-->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!--\ncomment\n-->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!--comment-->
        </template>
        `,
      options: ['never']
    },
    {
      code: `
        <template>
          <!--++++++++++++++++ comment ++++++++++++++++-->
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
        </template>
        `,
      options: ['never']
    },
    {
      code: `
        <template>
          <!---->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!---->
        </template>
        `,
      options: ['never']
    },
    {
      code: `
        <template>
          <!--

          -->
        </template>
        `,
      options: ['always']
    },
    {
      code: `
        <template>
          <!--

          -->
        </template>
        `,
      options: ['never']
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

    // invalid html
    {
      code: `
        <template>
          <!--
            comment
        </template>
        `,
      options: ['always']
    },

    // IE conditional comments
    `
      <template>
        <!--[if IE 8]>
        <div>IE8 only</div>
        <![endif]-->
      </template>
    `,
    `
      <template>
        <!--[if !IE]><!-->
        <div>not IE only</div>
        <!--<![endif]-->
      </template>
    `
  ],

  invalid: [
    {
      code: `
        <template>
          <!--comment-->
        </template>
        `,
      output: `
        <template>
          <!-- comment -->
        </template>
        `,
      options: ['always'],
      errors: [
        {
          message: "Expected space after '<!--'.",
          line: 3,
          column: 15,
          endColumn: 15
        },
        {
          message: "Expected space before '-->'.",
          line: 3,
          column: 22,
          endColumn: 22
        }
      ]
    },
    {
      code: `
        <template>
          <!-- comment -->
        </template>
        `,
      output: `
        <template>
          <!--comment-->
        </template>
        `,
      options: ['never'],
      errors: [
        {
          message: "Unexpected space after '<!--'.",
          line: 3,
          column: 15,
          endColumn: 16
        },
        {
          message: "Unexpected space before '-->'.",
          line: 3,
          column: 23,
          endColumn: 24
        }
      ]
    },
    {
      code: `
        <template>
          <!-- \t \t  \t\tcomment \t \t  \t\t-->
        </template>
        `,
      output: `
        <template>
          <!--comment-->
        </template>
        `,
      options: ['never'],
      errors: [
        {
          message: "Unexpected space after '<!--'.",
          line: 3,
          column: 15,
          endColumn: 23
        },
        {
          message: "Unexpected space before '-->'.",
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
      output: null,
      options: ['always', { exceptions: ['+'] }],
      errors: [
        'Expected space after exception block.',
        'Expected space before exception block.'
      ]
    },
    {
      code: `
        <template>
          <!--*****comment**-->
        </template>
        `,
      output: null,
      options: ['always', { exceptions: ['*'] }],
      errors: [
        'Expected space after exception block.',
        'Expected space before exception block.'
      ]
    },
    {
      code: `
        <template>
          <!--#+#-#+#-#+#-comment #+#-->
        </template>
        `,
      output: `
        <template>
          <!--#+#-#+#-#+#-comment #+# -->
        </template>
        `,
      options: ['always', { exceptions: ['#+#-'] }],
      errors: [
        'Expected space after exception block.',
        "Expected space before '-->'."
      ]
    },
    {
      code: `
        <template>
          <!--*****comment++++-->
        </template>
        `,
      output: null,
      options: ['always', { exceptions: ['*', '++'] }],
      errors: [
        'Expected space after exception block.',
        {
          message: 'Expected space before exception block.',
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
      output: null,
      options: ['always', { exceptions: ['*', '++'] }],
      errors: [
        'Expected space after exception block.',
        {
          message: 'Expected space before exception block.',
          line: 3,
          column: 28
        }
      ]
    }
  ]
})
