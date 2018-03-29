/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-content-newline')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('html-content-newline', rule, {
  valid: [
    `<template><div class="panel">content</div></template>`,
    `
      <template>
        <div class="panel">
          content
        </div>
      </template>`,
    `
      <template>
        <div
          class="panel"
        >
          content
        </div>
      </template>`,
    {
      code: `
        <template><div class="panel">
          content
        </div></template>
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }]
    },
    {
      code: `
        <template><div
            class="panel"
          >content</div></template>
        `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }]
    },
    // empty
    `<template><div class="panel"></div></template>`,
    {
      code: `<template><div
      class="panel"></div></template>`,
      options: [{
        singleline: 'never',
        multiline: 'never'
      }]
    },
    // self closing
    {
      code: `
        <template>
          <self-closing />
        </template>`,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }]
    },
    // ignores
    {
      code: `
        <template>
          <pre>content</pre>
          <pre
            id="test-pre"
          >content</pre>
          <pre><div>content</div></pre>
          <textarea>content</textarea>
          <textarea
            id="test-textarea"
          >content</textarea>
        </template>`,
      options: [{
        singleline: 'always',
        multiline: 'always'
      }]
    },
    {
      code: `
        <template>
          <ignore-tag>content</ignore-tag>
          <ignore-tag
            id="test-pre"
          >content</ignore-tag>
          <ignore-tag><div>content</div></ignore-tag>
        </template>`,
      options: [{
        singleline: 'always',
        multiline: 'always',
        ignoreNames: ['ignore-tag']
      }]
    },
    // multiline contents
    `
      <template>
        <div>
          <div>
            content
            content
          </div>
        </div>
      </template>
    `,
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
            class="panel"
          >content</div>
        </template>
      `,
      output: `
        <template>
          <div
            class="panel"
          >
content
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 5,
          column: 12,
          nodeType: 'HTMLTagClose',
          endLine: 5,
          endColumn: 12
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 5,
          column: 19,
          nodeType: 'HTMLEndTagOpen',
          endLine: 5,
          endColumn: 19
        }
      ]
    },
    {
      code: `
        <template>
          <div class="panel">content</div>
        </template>
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }],
      output: `
        <template>
          <div class="panel">
content
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 30,
          nodeType: 'HTMLTagClose',
          endLine: 3,
          endColumn: 30
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 37,
          nodeType: 'HTMLEndTagOpen',
          endLine: 3,
          endColumn: 37
        }
      ]
    },
    {
      code: `
        <template><div
            class="panel"
          >
            content
          </div></template>
      `,
      options: [{
        singleline: 'always',
        multiline: 'never'
      }],
      output: `
        <template><div
            class="panel"
          >content</div></template>
      `,
      errors: [
        {
          message: 'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
          line: 4,
          column: 12,
          nodeType: 'HTMLTagClose',
          endLine: 5,
          endColumn: 13
        },
        {
          message: 'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
          line: 5,
          column: 20,
          nodeType: 'HTMLEndTagOpen',
          endLine: 6,
          endColumn: 11
        }
      ]
    },
    // comments
    {
      code: `
        <template>
          <div><!--comment--></div>
        </template>
      `,
      options: [{
        singleline: 'always'
      }],
      output: `
        <template>
          <div>
<!--comment-->
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 16
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 30
        }
      ]
    },
    {
      code: `
        <template>
          <div>
          <!--comment-->
          </div>
        </template>
      `,
      options: [{
        singleline: 'never'
      }],
      output: `
        <template>
          <div><!--comment--></div>
        </template>
      `,
      errors: [
        {
          message: 'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
          line: 3,
          column: 16

        },
        {
          message: 'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
          line: 4,
          column: 25

        }
      ]
    },
    // one error
    {
      code: `
        <template>
          <div>content
          </div>
        </template>
      `,
      options: [{
        singleline: 'always'
      }],
      output: `
        <template>
          <div>
content
          </div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 16
        }
      ]
    },
    {
      code: `
        <template>
          <div>
          content</div>
        </template>
      `,
      options: [{
        singleline: 'always'
      }],
      output: `
        <template>
          <div>
          content
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 4,
          column: 18
        }
      ]
    },
    {
      code: `
        <template><div>content
          </div></template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'ignore'
      }],
      output: `
        <template><div>content</div></template>
      `,
      errors: [{
        message: 'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
        line: 2,
        column: 31 }]
    },
    {
      code: `
        <template><div>
          content</div></template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'ignore'
      }],
      output: `
        <template><div>content</div></template>
      `,
      errors: [{
        message: 'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
        line: 2,
        column: 24
      }]
    },
    // multiline content
    {
      code: `
        <template><div>content<div>content
        content</div>content</div></template>
      `,
      options: [{
        singleline: 'never'
      }],
      output: `
        <template>
<div>
content<div>
content
        content
</div>content
</div>
</template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "template" element, but no line breaks found.',
          line: 2,
          column: 19
        },
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 2,
          column: 24
        },
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 2,
          column: 36
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 16
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 29
        },
        {
          message: 'Expected 1 line break before opening bracket of the "template" element, but no line breaks found.',
          line: 3,
          column: 35
        }
      ]
    },
    // empty
    {
      code: `
        <template>
          <div></div>
        </template>
      `,
      options: [{
        singleline: 'always'
      }],
      output: `
        <template>
          <div>
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 16
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 16
        }
      ]
    },
    {
      code: `
        <template><div>
        </div></template>
      `,
      options: [{
        singleline: 'never',
        multiline: 'ignore'
      }],
      output: `
        <template><div></div></template>
      `,
      errors: [
        {
          message: 'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
          line: 2,
          column: 24
        },
        {
          message: 'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
          line: 2,
          column: 24

        }
      ]
    },
    // multi line breaks
    {
      code: `
        <template>
          <div>

            content

          </div>
        </template>
      `,
      options: [{
        singleline: 'always'
      }],
      output: `
        <template>
          <div>
content
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but 2 line breaks found.',
          line: 3,
          column: 16
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but 2 line breaks found.',
          line: 5,
          column: 20
        }
      ]
    },
    // mustache
    {
      code: `
        <template>
          <div>{{content}}</div>
        </template>
      `,
      options: [{
        singleline: 'always'
      }],
      output: `
        <template>
          <div>
{{content}}
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 16
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 27
        }
      ]
    }
  ]
})
