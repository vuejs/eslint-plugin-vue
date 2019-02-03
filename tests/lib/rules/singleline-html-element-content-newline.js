/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/singleline-html-element-content-newline')
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

tester.run('singleline-html-element-content-newline', rule, {
  valid: [
    `
      <template>
        <slot name="panel"></slot>
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
        <div class="panel">
          <div>
          </div>
        </div>
      </template>
    `,
    `
      <template>
        <div class="panel">
          <!-- comment -->
        </div>
      </template>
    `,
    `
      <template>
        <div>
          content
        </div>
      </template>
    `,
    `
      <template>
        <div>
          <div>
          </div>
        </div>
      </template>
    `,
    `
      <template>
        <div>
          <!-- comment -->
        </div>
      </template>
    `,
    `
      <template>
        <a href="/">Home</a>
      </template>
    `,
    `
      <template>
        <form>
          <label for="test">Home</label>
          <input id="test" name="test">
        </form>
      </template>
    `,

    // ignoreWhenNoAttributes: true
    `
      <template>
        <div>singleline content</div>
      </template>`,
    `
      <template>
        <tr><td>singleline</td><td>children</td></tr>
      </template>`,
    `
      <template>
        <div><!-- singleline comment --></div>
      </template>`,
    `
      <template>
        <div     >singleline element</div     >
      </template>`,
    `
      <template>
        <div></div>
      </template>`,
    `
      <template>
        <div>    </div>
      </template>`,

    // ignoreWhenNoAttributes: false
    {
      code: `
      <template>
        <div>
          content
        </div>
      </template>`,
      options: [{ ignoreWhenNoAttributes: false }]
    },
    {
      code: `
      <template>
        <div>
          <div>
          </div>
        </div>
      </template>`,
      options: [{ ignoreWhenNoAttributes: false }]
    },
    {
      code: `
      <template>
        <div>
          <!-- comment -->
        </div>
      </template>`,
      options: [{ ignoreWhenNoAttributes: false }]
    },
    // self closing
    `
      <template>
        <self-closing />
      </template>`,
    // ignores
    `
      <template>
        <pre>content</pre>
        <pre attr>content</pre>
        <pre><span attr>content</span></pre>
        <textarea>content</textarea>
        <textarea attr>content</textarea>
        <textarea><span attr>content</span></textarea>
      </template>`,
    {
      code: `
        <template>
          <ignore-tag>content</ignore-tag>
          <ignore-tag attr>content</ignore-tag>
          <ignore-tag><span attr>content</span></ignore-tag>
        </template>`,
      options: [{
        ignores: ['ignore-tag']
      }]
    },
    {
      code: `
        <template>
          <IgnoreTag>content</IgnoreTag>
          <IgnoreTag attr>content</IgnoreTag>
          <IgnoreTag><span attr>content</span></IgnoreTag>
        </template>`,
      options: [{
        ignores: ['IgnoreTag']
      }]
    },
    {
      code: `
        <template>
          <ignore-tag>content</ignore-tag>
          <ignore-tag attr>content</ignore-tag>
          <ignore-tag><span attr>content</span></ignore-tag>
        </template>`,
      options: [{
        ignores: ['IgnoreTag']
      }]
    },
    // not target
    `
      <template>
        <div>content
        </div>
      </template>`,
    `
      <template>
        <div>
          content</div>
      </template>`,
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
          message: 'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 30,
          nodeType: 'HTMLTagClose',
          endLine: 3,
          endColumn: 30
        },
        {
          message: 'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
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
        <template>
          <tr attr><td>singleline</td><td>children</td></tr>
        </template>
      `,
      output: `
        <template>
          <tr attr>
<td>singleline</td><td>children</td>
</tr>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<tr>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</tr>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div attr><!-- singleline comment --></div>
        </template>
      `,
      output: `
        <template>
          <div attr>
<!-- singleline comment -->
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
          <div attr><!-- singleline --><!-- comments --></div>
        </template>
      `,
      output: `
        <template>
          <div attr>
<!-- singleline --><!-- comments -->
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
          <div attr     >content</div    >
        </template>
      `,
      output: `
        <template>
          <div attr     >
content
</div    >
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
          <div attr     >content</div
          >
        </template>
      `,
      output: `
        <template>
          <div attr     >
content
</div
          >
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
          <div attr></div>
        </template>
      `,
      output: `
        <template>
          <div attr>
</div>
        </template>
      `,
      options: [{ ignoreWhenEmpty: false }],
      errors: [
        'Expected 1 line break after opening tag (`<div>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div attr>    </div>
        </template>
      `,
      output: `
        <template>
          <div attr>
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
          <div>singleline content</div>
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
      output: `
        <template>
          <div>
singleline content
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
          <tr><td>singleline</td><td>children</td></tr>
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
      output: `
        <template>
          <tr>
<td>
singleline
</td><td>
children
</td>
</tr>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<tr>`), but no line breaks found.',
        'Expected 1 line break after opening tag (`<td>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</td>`), but no line breaks found.',
        'Expected 1 line break after opening tag (`<td>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</td>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</tr>`), but no line breaks found.'
      ]
    },
    {
      code: `
        <template>
          <div><!-- singleline comment --></div>
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
      output: `
        <template>
          <div>
<!-- singleline comment -->
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
          <div   >   singleline element   </div   >
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
      output: `
        <template>
          <div   >
singleline element
</div   >
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
          <div></div>
        </template>
      `,
      options: [{ ignoreWhenEmpty: false, ignoreWhenNoAttributes: false }],
      output: `
        <template>
          <div>
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
          <div>    </div>
        </template>
      `,
      options: [{ ignoreWhenEmpty: false, ignoreWhenNoAttributes: false }],
      output: `
        <template>
          <div>
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
          <Div class="panel">content</Div>
        </template>
      `,
      output: `
        <template>
          <Div class="panel">
content
</Div>
        </template>
      `,
      errors: [
        'Expected 1 line break after opening tag (`<Div>`), but no line breaks found.',
        'Expected 1 line break before closing tag (`</Div>`), but no line breaks found.'
      ]
    }
  ]
})
