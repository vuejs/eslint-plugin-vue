/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-useless-mustaches'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-useless-mustaches', rule, {
  valid: [
    `
    <template>
      foo
      'foo'
      {{ foo }}
      {{ 'foo'||'bar' }}
      {{ 1 }}
      {{  }}
      {{ . }}
      {{ null }}
    </template>`,
    {
      code: `
      <template>
        {{ 'comment'/*comment*/ }}
        {{ 'comment'//comment
        " }}
      </template>
      `,
      options: [{ ignoreIncludesComment: true }]
    },
    {
      code: String.raw`
      <template>
        {{ '\n' }}
        {{ '\r' }}
      </template>`,
      options: [{ ignoreStringEscape: true }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
        {{ 'foo' }}
      </template>`,
      output: `
      <template>
        foo
      </template>`,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 20
        }
      ]
    },
    {
      code: `
      <template>
        {{ 'comment'/*comment*/ }}
        {{ 'comment'//comment
         }}
      </template>
      `,
      output: null,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 35
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 5,
          endColumn: 12
        }
      ]
    },
    {
      code: String.raw`
      <template>
        {{ '\n' }}
        {{ '\r' }}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 19
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 19
        }
      ]
    },
    {
      code: `
      <template>
        {{ '&quot;' }}
        {{ \`&quot;&apos;\` }}
        {{ '\\\\' }}
        {{ '\\\\r' }}
        {{ '\\' }}
        {{ \`foo\` }}
        {{ \`foo\${bar}\` }}
        {{ "&apos;" }}
        {{ \`foo\` }}
      </template>`,
      output: `
      <template>
        &quot;
        &quot;&apos;
        \\
        \\r
        {{ '\\' }}
        foo
        {{ \`foo\${bar}\` }}
        &apos;
        foo
      </template>`,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 29
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 19
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 20
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 20
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 23
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 11,
          column: 9,
          endLine: 11,
          endColumn: 20
        }
      ]
    },
    {
      code: `
      <template>
        {{ &apos;msg&apos; }}
        {{ &quot;msg&quot; }}
        {{ &apos;msg' }}
        {{ &quot;msg" }}
        {{ 'msg&apos; }}
        {{ "msg&quot; }}
        {{ &#39;&lt;msg&gt;&apos; }}
        {{ &#34;I&apos;m&#x22; }}
        {{ "no semi&#34 }}
      </template>`,
      output: `
      <template>
        msg
        msg
        msg
        msg
        msg
        msg
        &lt;msg&gt;
        I&apos;m
        {{ "no semi&#34 }}
      </template>`,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 30
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 30
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 25
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 25
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 25
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 25
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 37
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 34
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 11,
          column: 9,
          endLine: 11,
          endColumn: 27
        }
      ]
    },
    {
      code: `
      <template>
        {{ 'I\\'m' }}
        {{ "\\"Happy\\"" }}
        {{ \`backtick \\\` and dollar \\$\` }}
        {{ "\\\\" }}
      </template>`,
      output: `
      <template>
        I'm
        "Happy"
        backtick \` and dollar $
        \\
      </template>`,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 21
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 26
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 42
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 19
        }
      ]
    },
    {
      code: `
      <template>
        {{ '&lt;' }}
        {{ '&gt;' }}
        {{ '&amp;' }}
        {{ '&#8212;' }}
      </template>
      `,
      output: `
      <template>
        &lt;
        &gt;
        &amp;
        &#8212;
      </template>
      `,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 21
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 21
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 22
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 24
        }
      ]
    },
    {
      code: `
      <template>
        {{ '<' }}
        {{ '<<' }}
        {{ 'can be < anywhere' }}
        {{ '<tag>' }}
      </template>
      `,
      output: `
      <template>
        &lt;
        &lt;&lt;
        can be &lt; anywhere
        &lt;tag>
      </template>
      `,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 18
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 19
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 34
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      code: `
      <template>
        {{ \`foo
bar\` }}
      </template>
      `,
      output: null,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 4,
          endColumn: 8
        }
      ]
    },
    {
      code: `
      <template>
        {{ 'space ' }}
        {{ ' space' }}
        {{ ' space ' }}
        {{ '  ' }}
      </template>
      `,
      output: null,
      errors: [
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 23
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 23
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 24
        },
        {
          message:
            'Unexpected mustache interpolation with a string literal value.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 19
        }
      ]
    }
  ]
})
