/**
 * @author Yosuke Ota
 */
'use strict'

const rule = require('../../../lib/rules/multiline-html-element-content-newline')
const RuleTester = require('../../eslint-compat').RuleTester

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
      options: [
        {
          ignores: ['ignore-tag']
        }
      ]
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
      options: [
        {
          ignores: ['IgnoreTag']
        }
      ]
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
      options: [
        {
          ignores: ['IgnoreTag']
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
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 5,
          column: 12,
          type: 'HTMLTagClose',
          endLine: 5,
          endColumn: 12
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 5,
          column: 19,
          type: 'HTMLEndTagOpen',
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
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 15
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
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
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 20
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        }
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
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 30
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 25
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 23
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        }
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
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 18
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<template>`), but no line breaks found.',
          line: 2,
          column: 19,
          endLine: 2,
          endColumn: 19
        },
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 24
        },
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 2,
          column: 36,
          endLine: 2,
          endColumn: 36
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 29
        },
        {
          message:
            'Expected 1 line break before closing tag (`</template>`), but no line breaks found.',
          line: 3,
          column: 35,
          endLine: 3,
          endColumn: 35
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but 2 line breaks found.',
          line: 3,
          column: 16,
          endLine: 5,
          endColumn: 13
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but 2 line breaks found.',
          line: 6,
          column: 20,
          endLine: 8,
          endColumn: 11
        }
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
      output: `
        <template>
          <div
            class="panel">

          </div>
          <div
            class="panel">
</div>
        </template>`,
      options: [{ allowEmptyLines: true, ignoreWhenEmpty: false }],
      errors: [
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 8,
          column: 27,
          endLine: 8,
          endColumn: 27
        }
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
      options: [{ allowEmptyLines: true }],
      errors: [
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 9,
          column: 16,
          endLine: 9,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 10,
          column: 20,
          endLine: 10,
          endColumn: 20
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 23
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 16
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 27
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 14
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 21
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 18
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 25
        }
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
      errors: [
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 14
        }
      ]
    }
  ]
})
