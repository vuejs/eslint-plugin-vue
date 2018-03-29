/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-tag-attrs-content-newline')
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

tester.run('html-tag-attrs-content-newline', rule, {
  valid: [
    `<template><div>content</div></template>`,
    `<template><div>
      content</div></template>`,
    `
      <template><div>
        content
      </div></template>`,
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
    `
      <template><div class="panel">
        content
      </div></template>
    `,
    `
      <template><div
          class="panel"
        >
        content
      </div></template>
    `,
    // empty
    `<template><div class="panel">
      </div></template>`,
    `<template><div
      class="panel">
      </div></template>`,
    // self closing
    `
      <template>
        <self-closing />
      </template>`,
    // ignores
    `
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
        ignoreNames: ['ignore-tag']
      }]
    },
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
    `
      <template>
        <div attr>
        <!--comment-->
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
    // comments
    {
      code: `
        <template>
          <div attr><!--comment--></div>
        </template>
      `,
      output: `
        <template>
          <div attr>
<!--comment-->
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 21
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 35
        }
      ]
    },
    // one error
    {
      code: `
        <template>
          <div attr>content
          </div>
        </template>
      `,
      output: `
        <template>
          <div attr>
content
          </div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 21
        }
      ]
    },
    {
      code: `
        <template>
          <div attr>
          content</div>
        </template>
      `,
      output: `
        <template>
          <div attr>
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
    // multiline content
    {
      code: `
        <template><div attr>content<div attr>content
        content</div>content</div></template>
      `,
      output: `
        <template><div attr>
content<div attr>
content
        content
</div>content
</div></template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 2,
          column: 29
        },
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 2,
          column: 46
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
        }
      ]
    },
    // empty
    {
      code: `
        <template>
          <div attr></div>
        </template>
      `,
      output: `
        <template>
          <div attr>
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 21
        }
      ]
    },
    // multi line breaks
    {
      code: `
        <template>
          <div attr>

            content

          </div>
        </template>
      `,
      output: `
        <template>
          <div attr>
content
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but 2 line breaks found.',
          line: 3,
          column: 21
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
          <div attr>{{content}}</div>
        </template>
      `,
      output: `
        <template>
          <div attr>
{{content}}
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 21
        },
        {
          message: 'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
          line: 3,
          column: 32
        }
      ]
    }
  ]
})
