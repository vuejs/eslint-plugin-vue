/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/html-closing-bracket-spacing'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

ruleTester.run('html-closing-bracket-spacing', rule, {
  valid: [
    '',
    '<template><div></div><div /></template>',
    '<template><div foo></div><div foo /></template>',
    '<template><div foo=a></div><div foo=a /></template>',
    '<template><div foo="a"></div><div foo="a" /></template>',
    {
      code: '<template ><div ></div><div /></template>',
      options: [{ startTag: 'always' }]
    },
    {
      code: '<template><div></div ><div /></template >',
      options: [{ endTag: 'always' }]
    },
    {
      code: '<template><div></div><div/></template>',
      options: [{ selfClosingTag: 'never' }]
    },
    '<template><div',
    '<template><div></div',
    {
      code: '<template><div',
      options: [{ startTag: 'never', endTag: 'never' }]
    },
    {
      code: '<template><div></div',
      options: [{ startTag: 'never', endTag: 'never' }]
    }
  ],
  invalid: [
    {
      code: '<template>\n  <div >\n  </div >\n  <div/>\n</template>',
      output: '<template>\n  <div>\n  </div>\n  <div />\n</template>',
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 9
        },
        {
          message: "Expected no space before '>', but found.",
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 10
        },
        {
          message: "Expected a space before '/>', but not found.",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 9
        }
      ]
    },
    {
      code: '<template>\n  <div foo ></div>\n  <div foo/>\n</template>',
      output: '<template>\n  <div foo></div>\n  <div foo />\n</template>',
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 13
        },
        {
          message: "Expected a space before '/>', but not found.",
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 13
        }
      ]
    },
    {
      code: '<template>\n  <div foo="1" ></div>\n  <div foo="1"/>\n</template>',
      output:
        '<template>\n  <div foo="1"></div>\n  <div foo="1" />\n</template>',
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 17
        },
        {
          message: "Expected a space before '/>', but not found.",
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 17
        }
      ]
    },
    {
      code: `
        <template ></template >
        <script ></script >
        <style ></style >
      `,
      output: `
        <template></template>
        <script></script>
        <style></style>
      `,
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 18,
          endLine: 2,
          endColumn: 20
        },
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 30,
          endLine: 2,
          endColumn: 32
        },
        {
          message: "Expected no space before '>', but found.",
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 18
        },
        {
          message: "Expected no space before '>', but found.",
          line: 3,
          column: 26,
          endLine: 3,
          endColumn: 28
        },
        {
          message: "Expected no space before '>', but found.",
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 17
        },
        {
          message: "Expected no space before '>', but found.",
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template >\n  <div>\n  </div>\n  <div />\n</template >',
      output: '<template >\n  <div >\n  </div >\n  <div/>\n</template >',
      options: [
        {
          startTag: 'always',
          endTag: 'always',
          selfClosingTag: 'never'
        }
      ],
      errors: [
        {
          message: "Expected a space before '>', but not found.",
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 8
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 9
        },
        {
          message: "Expected no space before '/>', but found.",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 10
        }
      ]
    },
    {
      code: `
        <template></template>
        <script></script>
        <style></style>
      `,
      output: `
        <template ></template >
        <script ></script >
        <style ></style >
      `,
      options: [
        {
          startTag: 'always',
          endTag: 'always',
          selfClosingTag: 'never'
        }
      ],
      errors: [
        {
          message: "Expected a space before '>', but not found.",
          line: 2,
          column: 18,
          endLine: 2,
          endColumn: 19
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 2,
          column: 29,
          endLine: 2,
          endColumn: 30
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 3,
          column: 16,
          endLine: 3,
          endColumn: 17
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 26
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 16
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 24
        }
      ]
    }
  ]
})
