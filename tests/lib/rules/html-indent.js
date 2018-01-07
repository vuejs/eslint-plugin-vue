/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const fs = require('fs')
const path = require('path')
const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/html-indent')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const FIXTURE_ROOT = path.resolve(__dirname, '../../fixtures/html-indent/')

/**
 * Load test patterns from fixtures.
 *
 * - Valid tests:   All codes in FIXTURE_ROOT are valid code.
 * - Invalid tests: There is an invalid test for every valid test. It removes
 *                  all indentations from the valid test and checks whether
 *                  `html-indent` rule restores the removed indentations exactly.
 *
 * If a test has some ignored line, we can't use the mechanism.
 * So `additionalValid` and `additionalInvalid` exist for asymmetry test cases.
 *
 * @param {object[]} additionalValid The array of additional valid patterns.
 * @param {object[]} additionalInvalid The array of additional invalid patterns.
 * @returns {object} The loaded patterns.
 */
function loadPatterns (additionalValid, additionalInvalid) {
  const valid = fs
    .readdirSync(FIXTURE_ROOT)
    .map(filename => {
      const code0 = fs.readFileSync(path.join(FIXTURE_ROOT, filename), 'utf8')
      const code = code0.replace(/^<!--(.+?)-->/, `<!--${filename}-->`)
      const baseObj = JSON.parse(/^<!--(.+?)-->/.exec(code0)[1])
      return Object.assign(baseObj, { code, filename })
    })
  const invalid = valid
    .map(pattern => {
      const kind = ((pattern.options && pattern.options[0]) === 'tab') ? 'tab' : 'space'
      const output = pattern.code
      const lines = output
        .split('\n')
        .map((text, number) => ({
          number,
          text,
          indentSize: (/^[ \t]+/.exec(text) || [''])[0].length
        }))
      const code = lines
        .map(line => line.text.replace(/^[ \t]+/, ''))
        .join('\n')
      const errors = lines
        .map(line =>
          line.indentSize === 0
            ? null
            : { message: `Expected indentation of ${line.indentSize} ${kind}${line.indentSize === 1 ? '' : 's'} but found 0 ${kind}s.`, line: line.number + 1 }
        )
        .filter(Boolean)

      return Object.assign({}, pattern, { code, output, errors })
    })
    .filter(Boolean)

  return {
    valid: valid.concat(additionalValid),
    invalid: invalid.concat(additionalInvalid)
  }
}

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent (strings) {
  const templateValue = strings[0]
  const lines = templateValue.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n')
  const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */)[0].length)
  const minLineIndent = Math.min.apply(null, lineIndents)

  return lines.map(line => line.slice(minLineIndent)).join('\n')
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      globalReturn: true
    }
  }
})

tester.run('html-indent', rule, loadPatterns(
  // Valid
  [
    // TemplateLiteral
    unIndent`
      <template>
        <div
          v-bind:b="
            \`
            test
          test
            test
            \`
          "
        ></div>
      </template>
    `,

    // VAttribute
    unIndent`
      <template>
        <div a="
        a" b="b"></div>
      </template>
    `,

    // Comments
    unIndent`
      <template>
        <!-- comment -->
        {{
          // comment
          // comment
          message
        }}
      </template>
    `,
    unIndent`
      <template>
        {{
          /*
           * comment
           */
          message
        }}
      </template>
    `,
    unIndent`
      <template>
        {{
          message
          // comment
          // comment
        }}
        <!-- comment -->
      </template>
    `,
    unIndent`
      <template>
        {{
          message
          /*
           * comment
           */
        }}
      </template>
    `,
    unIndent`
      <template>
        {{
          message
        // comment
        // comment
        }}
        <!-- comment -->
      </template>
    `,
    unIndent`
      <template>
        {{
          message
        /*
         * comment
         */
        }}
      </template>
    `,

    // Ignores
    {
      code: unIndent`
        <template>
              <div
            id
          =
            >
          Hello
        <span>
        </template>
      `,
      options: [4, {
        // Ignore all :D
        ignores: ['*']
      }]
    }
  ],

  // Invalid
  [
    // TemplateLiteral
    {
      code: unIndent`
        <template>
            <div
                v-bind:b="
                  \`
                    test
                  test
                      test
                    \`
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:b="
                    \`
                    test
                  test
                      test
                    \`
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 }
      ]
    },

    // A mix of spaces and tabs.
    {
      code: unIndent`
        <template>
          <div>
          \tHello
          </div>
        </template>
      `,
      output: unIndent`
        <template>
          <div>
            Hello
          </div>
        </template>
      `,
      errors: [
        { message: 'Expected " " character, but found "\\t" character.', line: 3 }
      ]
    },
    {
      code: unIndent`
        <template>
        \t<div>
        \t    Hello
        \t</div>
        </template>
      `,
      output: unIndent`
        <template>
        \t<div>
        \t\tHello
        \t</div>
        </template>
      `,
      options: ['tab'],
      errors: [
        { message: 'Expected "\\t" character, but found " " character.', line: 3 }
      ]
    },

    // Comments
    {
      code: unIndent`
        <template>
        <!-- comment -->
        {{
        // comment
        // comment
        message
        }}
        </template>
      `,
      output: unIndent`
        <template>
          <!-- comment -->
          {{
            // comment
            // comment
            message
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 2 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 5 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 6 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 7 }
      ]
    },
    {
      code: unIndent`
        <template>
          {{
          /*
           * comment
           */
          message
          }}
        </template>
      `,
      output: unIndent`
        <template>
          {{
            /*
             * comment
             */
            message
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 6 }
      ]
    },
    {
      code: unIndent`
        <template>
        {{
        message
        // comment
        // comment
        }}
        <!-- comment -->
        </template>
      `,
      output: unIndent`
        <template>
          {{
            message
            // comment
            // comment
          }}
        <!-- comment -->
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 2 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 5 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 6 }
      ]
    },
    {
      code: unIndent`
        <template>
        {{
        message
        /*
         * comment
         */
        }}
        </template>
      `,
      output: unIndent`
        <template>
          {{
            message
            /*
             * comment
             */
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 2 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 4 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 7 }
      ]
    },

    // Ignores
    {
      code: unIndent`
        <template>
            <div
            id=""
              class=""
                />
        </template>
      `,
      output: unIndent`
        <template>
            <div
            id=""
              class=""
            />
        </template>
      `,
      options: [4, {
        ignores: ['VAttribute']
      }],
      errors: [
        { message: 'Expected indentation of 4 spaces but found 8 spaces.', line: 5 }
      ]
    },
    {
      code: unIndent`
        <template>
            {{
              obj
                .foo[
                "bar"
                ].baz
            }}
        </template>
      `,
      output: unIndent`
        <template>
            {{
                obj
                    .foo[
                "bar"
                    ].baz
            }}
        </template>
      `,
      options: [4, {
        // Ignore inside of computed properties.
        ignores: ['MemberExpression[computed=true] *.property']
      }],
      errors: [
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 3 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 6 }
      ]
    }
  ]
))
