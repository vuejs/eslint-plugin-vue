/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/multiline-html-element-content-newline')
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

tester.run('multiline-html-element-content-newline', rule, {
  valid: [
    `<template><div class="panel">content</div></template>`,
    `<template><div class="panel"><div></div></div></template>`,
    `<template><div class="panel"><!-- comment --></div></template>`,
    `
      <template>
        <slot
          name="panel"
        ></slot>
      </template>
    `,
    `
      <template>
        <div
          ></div>
      </template>
    `,
    `
      <template>
        <div class="panel">
          content
        </div>
      </template>
    `,
    `
      <template>
        <div
          class="panel"
        >
          content
        </div>
      </template>
    `,
    `
      <template>
        <a
          href="/"
          class="link"
        >Home</a>
      </template>
    `,
    `
      <template>
        <a
          href="/"
          class="link"
        >Home
        </a>
      </template>
    `,
    `
      <template>
        <a
          href="/"
          class="link"
        >
          Home
        </a>
      </template>
    `,
    `
      <template>
        <div>
          <label
            for="test"
            class="label"
          >Foo</label>
          <input id="test">
        </div>
      </template>
    `,
    `
      <template>
        <div>
          <label
            for="test"
            class="label"
          >Foo
          </label>
          <input id="test">
        </div>
      </template>
    `,
    `
      <template>
        <div>
          <label
            for="test"
            class="label"
          >
            Foo
          </label>
          <input id="test">
        </div>
      </template>
    `,
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
      <div>multiline end tag</div
      >
    `,

    // empty
    `<template><div class="panel"></div></template>`,
    `
      <template>
        <div
          class="panel">
        </div>
      </template>
    `,

    // allowEmptyLines
    {
      code: `
        <template>
          <div
            class="panel">

          </div>
        </template>`,
      options: [{ allowEmptyLines: true, ignoreWhenEmpty: false }]
    },
    {
      code: `
        <template>
          <div
            class="panel">

            contents

          </div>
        </template>`,
      options: [{ allowEmptyLines: true }]
    },
    {
      code: `
        <template>
          <div
            class="panel">


            contents


          </div>
        </template>`,
      options: [{ allowEmptyLines: true }]
    },

    // self closing
    `
      <template>
        <self-closing />
      </template>
    `,

    // ignores
    `
      <template>
        <pre>content</pre>
        <pre
          id="test-pre"
        >content</pre>
        <pre><div
          >content</div></pre>
        <pre>content
          content</pre>
        <textarea>content</textarea>
        <textarea
          id="test-textarea"
        >content</textarea>
        <textarea>content
          content</textarea>
      </template>`,
    {
      code: `
        <template>
          <ignore-tag>content</ignore-tag>
          <ignore-tag
            id="test-pre"
          >content</ignore-tag>
          <ignore-tag><div
            >content</div></ignore-tag>
          <ignore-tag>content
            content</ignore-tag>
        </template>`,
      options: [{
        ignores: ['ignore-tag']
      }]
    },
    {
      code: `
        <template>
          <IgnoreTag>content</IgnoreTag>
          <IgnoreTag
            id="test-pre"
          >content</IgnoreTag>
          <IgnoreTag><div
            >content</div></IgnoreTag>
          <IgnoreTag>content
            content</IgnoreTag>
        </template>`,
      options: [{
        ignores: ['IgnoreTag']
      }]
    },
    {
      code: `
        <template>
          <ignore-tag>content</ignore-tag>
          <ignore-tag
            id="test-pre"
          >content</ignore-tag>
          <ignore-tag><div
            >content</div></ignore-tag>
          <ignore-tag>content
            content</ignore-tag>
        </template>`,
      options: [{
        ignores: ['IgnoreTag']
      }]
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
          message: 'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 5,
          column: 12,
          nodeType: 'HTMLTagClose',
          endLine: 5,
          endColumn: 12
        },
        {
          message: 'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 5,
          column: 19,
          nodeType: 'HTMLEndTagOpen',
          endLine: 5,
          endColumn: 19
        }
      ]
    },
    // spaces
    {
      code: `
        <template>
          <div
            class="panel"
          >   content</div>
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
          message: 'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 15
        },
        {
          message: 'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 22
        }
      ]
    },
    // elements
    {
      code: `
        <template>
          <div><div></div>
          <div></div></div>
        </template>
      `,
      output: `
        <template>
          <div>
<div></div>
          <div></div>
</div>
        </template>
      `,
      errors: [
        {
          message: 'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message: 'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    // contents
    {
      code: `
        <template>
          <div>multiline
            content</div>
        </template>`,
      output: `
        <template>
          <div>
multiline
            content
</div>
        </template>`,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div>multiline content
          </div>
        </template>`,
      output: `
        <template>
          <div>
multiline content
          </div>
        </template>`,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div>
            multiline content</div>
        </template>`,
      output: `
        <template>
          <div>
            multiline content
</div>
        </template>`,
      errors: [
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    // comments
    {
      code: `
        <template>
          <div><!--comment-->
          <!--comment--></div>
        </template>
      `,
      output: `
        <template>
          <div>
<!--comment-->
          <!--comment-->
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div><!--comment
            comment--></div>
        </template>
      `,
      output: `
        <template>
          <div>
<!--comment
            comment-->
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    // one error
    {
      code: `
        <template>
          <div>content
            content
          </div>
        </template>
      `,
      output: `
        <template>
          <div>
content
            content
          </div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div>
          content
          content</div>
        </template>
      `,
      output: `
        <template>
          <div>
          content
          content
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    // multi
    {
      code: `
        <template><div>content<div>content
        content</div>content</div></template>
      `,
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
        'Expected 1 line break after opening tag (`<template>`), but no line breaks found.',
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</template>`), but no line breaks found.'
      ]
    },
    // multi line breaks
    {
      code: `
        <template>
          <div>

            content
            content

          </div>
        </template>
      `,
      output: `
        <template>
          <div>
content
            content
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but 2 line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but 2 line breaks found.'
      ]
    },
    // allowEmptyLines
    {
      code: `
        <template>
          <div
            class="panel">

          </div>
          <div
            class="panel"></div>
        </template>`,
      options: [{ allowEmptyLines: true, ignoreWhenEmpty: false }],
      output: `
        <template>
          <div
            class="panel">

          </div>
          <div
            class="panel">
</div>
        </template>`,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div>

            content
            content

          </div>
          <div>content
            content</div>
        </template>
      `,
      options: [{ allowEmptyLines: true }],
      output: `
        <template>
          <div>

            content
            content

          </div>
          <div>
content
            content
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    // mustache
    {
      code: `
        <template>
          <div>{{content}}
          {{content2}}</div>
        </template>
      `,
      output: `
        <template>
          <div>
{{content}}
          {{content2}}
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    // mix
    {
      code: `
        <template>
          <div>content
          <child></child>
          <!-- comment --></div>
        </template>
      `,
      output: `
        <template>
          <div>
content
          <child></child>
          <!-- comment -->
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    // start tag
    {
      code: `
        <template>
          <div
            >content</div>
        </template>
      `,
      output: `
        <template>
          <div
            >
content
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
            attr>content</div>
        </template>
      `,
      output: `
        <template>
          <div
            attr>
content
</div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div
            ></div>
        </template>
      `,
      output: `
        <template>
          <div
            >
</div>
        </template>
      `,
      options: [{ ignoreWhenEmpty: false }],
      errors: ['Expected 1 line break after opening tag (`<div>`), but no line breaks found.']
    }
  ]
})
