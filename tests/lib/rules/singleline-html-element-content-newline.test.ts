/**
 * @author Yosuke Ota
 */
import rule from '../../../lib/rules/singleline-html-element-content-newline'
import { RuleTester } from '../../eslint-compat'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
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
          <IgnoreTag attr>content</IgnoreTag>
          <IgnoreTag><span attr>content</span></IgnoreTag>
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
          <ignore-tag attr>content</ignore-tag>
          <ignore-tag><span attr>content</span></ignore-tag>
        </template>`,
      options: [
        {
          ignores: ['IgnoreTag']
        }
      ]
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
    `,
    {
      code: `
        <template>
          <pre>content</pre>
          <IgnoreTag>content</IgnoreTag>
          <IgnoreTag attr>content</IgnoreTag>
          <IgnoreTag><span attr>content</span></IgnoreTag>
        </template>`,
      options: [
        {
          externalIgnores: ['IgnoreTag']
        }
      ]
    },
    {
      code: `
        <template>
        <pre>content</pre>
          <ignore-tag>content</ignore-tag>
          <ignore-tag attr>content</ignore-tag>
          <ignore-tag><span attr>content</span></ignore-tag>
        </template>`,
      options: [
        {
          externalIgnores: ['IgnoreTag']
        }
      ]
    }
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
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 30
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 37,
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
        {
          message:
            'Expected 1 line break after opening tag (`<tr>`), but no line breaks found.',
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 20
        },
        {
          message:
            'Expected 1 line break before closing tag (`</tr>`), but no line breaks found.',
          line: 3,
          column: 56,
          endLine: 3,
          endColumn: 56
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 21
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 48,
          endLine: 3,
          endColumn: 48
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 21
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 57,
          endLine: 3,
          endColumn: 57
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 26
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 33
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 26
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 33
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 21
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 25
        }
      ]
    },
    {
      code: `
        <template>
          <div>singleline content</div>
        </template>
      `,
      output: `
        <template>
          <div>
singleline content
</div>
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
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
          line: 3,
          column: 34,
          endLine: 3,
          endColumn: 34
        }
      ]
    },
    {
      code: `
        <template>
          <tr><td>singleline</td><td>children</td></tr>
        </template>
      `,
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
      options: [{ ignoreWhenNoAttributes: false }],
      errors: [
        {
          message:
            'Expected 1 line break after opening tag (`<tr>`), but no line breaks found.',
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 15
        },
        {
          message:
            'Expected 1 line break after opening tag (`<td>`), but no line breaks found.',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 19
        },
        {
          message:
            'Expected 1 line break before closing tag (`</td>`), but no line breaks found.',
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 29
        },
        {
          message:
            'Expected 1 line break after opening tag (`<td>`), but no line breaks found.',
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 38
        },
        {
          message:
            'Expected 1 line break before closing tag (`</td>`), but no line breaks found.',
          line: 3,
          column: 46,
          endLine: 3,
          endColumn: 46
        },
        {
          message:
            'Expected 1 line break before closing tag (`</tr>`), but no line breaks found.',
          line: 3,
          column: 51,
          endLine: 3,
          endColumn: 51
        }
      ]
    },
    {
      code: `
        <template>
          <div><!-- singleline comment --></div>
        </template>
      `,
      output: `
        <template>
          <div>
<!-- singleline comment -->
</div>
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
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
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 43
        }
      ]
    },
    {
      code: `
        <template>
          <div   >   singleline element   </div   >
        </template>
      `,
      output: `
        <template>
          <div   >
singleline element
</div   >
        </template>
      `,
      options: [{ ignoreWhenNoAttributes: false }],
      errors: [
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 22
        },
        {
          message:
            'Expected 1 line break before closing tag (`</div>`), but no line breaks found.',
          line: 3,
          column: 40,
          endLine: 3,
          endColumn: 43
        }
      ]
    },
    {
      code: `
        <template>
          <div></div>
        </template>
      `,
      output: `
        <template>
          <div>
</div>
        </template>
      `,
      options: [{ ignoreWhenEmpty: false, ignoreWhenNoAttributes: false }],
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
          <div>    </div>
        </template>
      `,
      output: `
        <template>
          <div>
</div>
        </template>
      `,
      options: [{ ignoreWhenEmpty: false, ignoreWhenNoAttributes: false }],
      errors: [
        {
          message:
            'Expected 1 line break after opening tag (`<div>`), but no line breaks found.',
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 20
        }
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
        {
          message:
            'Expected 1 line break after opening tag (`<Div>`), but no line breaks found.',
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 30
        },
        {
          message:
            'Expected 1 line break before closing tag (`</Div>`), but no line breaks found.',
          line: 3,
          column: 37,
          endLine: 3,
          endColumn: 37
        }
      ]
    }
  ]
})
