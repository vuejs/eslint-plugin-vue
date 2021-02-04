/**
 * @author Yosuke ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/html-comment-indent')

const RuleTester = require('eslint').RuleTester

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
})
tester.run('html-comment-indent', rule, {
  valid: [
    {
      code: `
        <template>
          <!-- comment
            comment
          -->
          <!--
            comment
            comment
          -->
            <!--
              comment
              comment
            -->
        </template>
        `
    },
    {
      code: `
        <template>
          <!-- comment
          \tcomment
          -->
          <!--
          \tcomment
          \tcomment
          -->
            <!--
            \tcomment
            \tcomment
            -->
        </template>
        `,
      options: ['tab']
    },
    {
      code: `
        <template>
          <!-- comment
              comment
          -->
          <!--
              comment
              comment
          -->
            <!--
                comment
                comment
            -->
        </template>
        `,
      options: [4]
    },
    {
      code: `
        <template>
          <!-- comment
          comment
          -->
          <!--
          comment
          comment
          -->
            <!--
            comment
            comment
            -->
        </template>
        `,
      options: [0]
    },
    {
      code: `
        <template>
          <!-- comment
        \t
            comment
            \t
            comment
          \t
          -->
          <!--
        \t
          -->
          <!--
          -->
        </template>
        `
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
          <!-- comment
          comment
          -->
          <!--
       comment
               comment
           -->
            <!--
             \tcomment
            \tcomment
           -->
        </template>
        `,
      output: `
        <template>
          <!-- comment
            comment
          -->
          <!--
            comment
            comment
          -->
            <!--
              comment
              comment
            -->
        </template>
        `,
      errors: [
        {
          message:
            'Expected relative indentation of 2 spaces but found 0 spaces.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 11
        },
        {
          message:
            'Expected base point indentation of 10 spaces, but found 7 spaces.',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 8
        },
        {
          message:
            'Expected relative indentation of 2 spaces but found 5 spaces.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 16
        },
        {
          message:
            'Expected relative indentation of 0 spaces but found 1 space.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 12
        },
        {
          message: 'Expected space character, but found tab character.',
          line: 11,
          column: 14,
          endLine: 11,
          endColumn: 15
        },
        {
          message: 'Expected space character, but found tab character.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 14
        },
        {
          message:
            'Expected base point indentation of 12 spaces, but found 11 spaces.',
          line: 13,
          column: 1,
          endLine: 13,
          endColumn: 12
        }
      ]
    },
    {
      code: `
        <template>
          <!-- comment
          comment
          -->
          <!--
        \tcomment
          \t\tcomment
          \t-->
            <!--
            \t comment
             comment
           -->
        </template>
        `,
      options: ['tab'],
      output: `
        <template>
          <!-- comment
          \tcomment
          -->
          <!--
          \tcomment
          \tcomment
          -->
            <!--
            \tcomment
            \tcomment
            -->
        </template>
        `,
      errors: [
        {
          message: 'Expected relative indentation of 1 tab but found 0 tabs.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 11
        },
        {
          message:
            'Expected base point indentation of 10 spaces, but found "        \\t".',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 10
        },
        {
          message: 'Expected relative indentation of 1 tab but found 2 tabs.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 13
        },
        {
          message: 'Expected relative indentation of 0 tabs but found 1 tab.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 12
        },
        {
          message: 'Expected tab character, but found space character.',
          line: 11,
          column: 14,
          endLine: 11,
          endColumn: 15
        },
        {
          message: 'Expected tab character, but found space character.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 14
        },
        {
          message:
            'Expected base point indentation of 12 spaces, but found 11 spaces.',
          line: 13,
          column: 1,
          endLine: 13,
          endColumn: 12
        }
      ]
    },
    {
      code: `
        <template>
          <!-- comment
          comment
          -->
          <!--
     comment
                  comment
            -->
            <!--
              \tcomment
            \t  comment
          -->
        </template>
        `,
      options: [4],
      output: `
        <template>
          <!-- comment
              comment
          -->
          <!--
              comment
              comment
          -->
            <!--
                comment
                comment
            -->
        </template>
        `,
      errors: [
        {
          message:
            'Expected relative indentation of 4 spaces but found 0 spaces.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 11
        },
        {
          message:
            'Expected base point indentation of 10 spaces, but found 5 spaces.',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 6
        },
        {
          message:
            'Expected relative indentation of 4 spaces but found 8 spaces.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 19
        },
        {
          message:
            'Expected relative indentation of 0 spaces but found 2 spaces.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 13
        },
        {
          message: 'Expected space character, but found tab character.',
          line: 11,
          column: 15,
          endLine: 11,
          endColumn: 16
        },
        {
          message: 'Expected space character, but found tab character.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 14
        },
        {
          message:
            'Expected base point indentation of 12 spaces, but found 10 spaces.',
          line: 13,
          column: 1,
          endLine: 13,
          endColumn: 11
        }
      ]
    },
    {
      code: `
        <template>
          <!--
            comment
          -->
          <!--
        comment
          \tcomment
            -->
            <!--
            \tcomment
          \tcomment
          -->
        </template>
        `,
      options: [0],
      output: `
        <template>
          <!--
          comment
          -->
          <!--
          comment
          comment
          -->
            <!--
            comment
            comment
            -->
        </template>
        `,
      errors: [
        {
          message:
            'Expected relative indentation of 0 spaces but found 2 spaces.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 13
        },
        {
          message:
            'Expected base point indentation of 10 spaces, but found 8 spaces.',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 9
        },
        {
          message: 'Expected space character, but found tab character.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 12
        },
        {
          message:
            'Expected relative indentation of 0 spaces but found 2 spaces.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 13
        },
        {
          message: 'Expected space character, but found tab character.',
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 14
        },
        {
          message:
            'Expected base point indentation of 12 spaces, but found "          \\t".',
          line: 12,
          column: 1,
          endLine: 12,
          endColumn: 12
        },
        {
          message:
            'Expected base point indentation of 12 spaces, but found 10 spaces.',
          line: 13,
          column: 1,
          endLine: 13,
          endColumn: 11
        }
      ]
    },
    {
      code: `
        <template>
          <!--
        \t
          comment
            \t
              comment
          \t
          -->
          <!--
        \t
            -->
          <!--
        -->
        </template>
        `,
      output: `
        <template>
          <!--
        \t
            comment
            \t
            comment
          \t
          -->
          <!--
        \t
          -->
          <!--
          -->
        </template>
        `,
      errors: [
        {
          message:
            'Expected relative indentation of 2 spaces but found 0 spaces.',
          line: 5
        },
        {
          message:
            'Expected relative indentation of 2 spaces but found 4 spaces.',
          line: 7
        },
        {
          message:
            'Expected relative indentation of 0 spaces but found 2 spaces.',
          line: 12
        },
        {
          message:
            'Expected base point indentation of 10 spaces, but found 8 spaces.',
          line: 14
        }
      ]
    },
    {
      code: `
        <template>
          <!-- comment
          comment -->
          <!-- comment
              comment -->
        </template>
        `,
      output: `
        <template>
          <!-- comment
            comment -->
          <!-- comment
            comment -->
        </template>
        `,
      errors: [
        {
          message:
            'Expected relative indentation of 2 spaces but found 0 spaces.',
          line: 4
        },
        {
          message:
            'Expected relative indentation of 2 spaces but found 4 spaces.',
          line: 6
        }
      ]
    },
    {
      code: `
<template>
<!-- comment
comment
comment -->
<!--
  -->
</template>
`,
      output: `
<template>
<!-- comment
  comment
  comment -->
<!--
-->
</template>
`,
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 0 spaces.',
          line: 4
        },
        {
          message: 'Expected indentation of 2 spaces but found 0 spaces.',
          line: 5
        },
        {
          message: 'Expected indentation of 0 spaces but found 2 spaces.',
          line: 7
        }
      ]
    },
    {
      code: `
<template>
  <!-- comment
comment
comment -->
  <!--
-->
</template>
`,
      output: `
<template>
  <!-- comment
    comment
    comment -->
  <!--
  -->
</template>
`,
      errors: [
        {
          message:
            'Expected base point indentation of 2 spaces, but not found.',
          line: 4
        },
        {
          message:
            'Expected base point indentation of 2 spaces, but not found.',
          line: 5
        },
        {
          message:
            'Expected base point indentation of 2 spaces, but not found.',
          line: 7
        }
      ]
    },
    {
      code: `
        <template>
          <div><!--
           comment
           --></div>
        </template>
        `,
      output: `
        <template>
          <div><!--
            comment
          --></div>
        </template>
        `,
      errors: [
        {
          message:
            'Expected relative indentation of 2 spaces but found 1 space.',
          line: 4
        },
        {
          message:
            'Expected relative indentation of 0 spaces but found 1 space.',
          line: 5
        }
      ]
    },
    {
      code: `
        <template>
 \t \t \t <!--
            comment
          -->
        </template>
        `,
      output: `
        <template>
 \t \t \t <!--
 \t \t \t   comment
 \t \t \t -->
        </template>
        `,
      errors: [
        {
          message:
            'Expected base point indentation of " \\t \\t \\t ", but found 7 spaces.',
          line: 4
        },
        {
          message:
            'Expected base point indentation of " \\t \\t \\t ", but found 7 spaces.',
          line: 5
        }
      ]
    }
  ]
})
