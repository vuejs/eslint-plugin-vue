/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-parsing-error'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('no-parsing-error', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template>a b c</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>{{a + b + c}}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template><svg class="icon"><use xlink:href="#chevron"></use></svg></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><svg viewBox="0 0 40 40"></svg></template>'
    },
    {
      filename: 'test.vue',
      code: '<table><tr><td></td></tr></table>'
    },
    {
      filename: 'test.vue',
      code: '<a @click="foo(); bar()">link</a>'
    },
    {
      filename: 'test.vue',
      code: `<template v-for="x of list"><slot name="item" /></template>`
    },
    {
      code: `<template><!--></template>`,
      options: [{ 'abrupt-closing-of-empty-comment': false }]
    },
    {
      code: `<template><!---></template>`,
      options: [{ 'abrupt-closing-of-empty-comment': false }]
    },
    {
      code: `<template>&#qux;</template>`,
      options: [{ 'absence-of-digits-in-numeric-character-reference': false }]
    },
    {
      code: '<template><![CDATA[cdata]]></template>',
      options: [{ 'cdata-in-html-content': false }]
    },
    {
      code: '<template>&#1234567;</template>',
      options: [{ 'character-reference-outside-unicode-range': false }]
    },
    {
      code: '<template>\u0003</template>',
      options: [{ 'control-character-in-input-stream': false }]
    },
    {
      code: '<template>&#0003;</template>',
      options: [{ 'control-character-reference': false }]
    },
    {
      code: '<template><',
      options: [{ 'eof-before-tag-name': false }]
    },
    {
      code: '<template><svg><![CDATA[cdata',
      options: [{ 'eof-in-cdata': false }]
    },
    {
      code: '<template><!--comment',
      options: [{ 'eof-in-comment': false }]
    },
    {
      code: '<template><div class=""',
      options: [{ 'eof-in-tag': false }]
    },
    {
      code: '<template><!--comment--!></template>',
      options: [{ 'incorrectly-closed-comment': false }]
    },
    {
      code: '<template><!ELEMENT br EMPTY></template>',
      options: [{ 'incorrectly-opened-comment': false }]
    },
    {
      code: '<template><👍>/template>',
      options: [{ 'invalid-first-character-of-tag-name': false }]
    },
    {
      code: '<template><div id=></template>',
      options: [{ 'missing-attribute-value': false }]
    },
    {
      code: '<template></></template>',
      options: [{ 'missing-end-tag-name': false }]
    },
    {
      code: '<template>&amp</template>',
      options: [{ 'missing-semicolon-after-character-reference': false }]
    },
    {
      code: '<template><div id="foo"class="bar"></template>',
      options: [{ 'missing-whitespace-between-attributes': false }]
    },
    {
      code: '<template><!--a<!--b--></template>',
      options: [{ 'nested-comment': false }]
    },
    {
      code: '<template>&#xFFFE;</template>',
      options: [{ 'noncharacter-character-reference': false }]
    },
    {
      code: '<template>\uFFFE</template>',
      options: [{ 'noncharacter-in-input-stream': false }]
    },
    {
      code: '<template>&#0000;</template>',
      options: [{ 'null-character-reference': false }]
    },
    {
      code: '<template>&#xD800;</template>',
      options: [{ 'surrogate-character-reference': false }]
    },
    {
      code: '<template>\uD800</template>',
      options: [{ 'surrogate-in-input-stream': false }]
    },
    {
      code: '<template><div a"bc=""></template>',
      options: [{ 'unexpected-character-in-attribute-name': false }]
    },
    {
      code: '<template><div foo=bar"></template>',
      options: [{ 'unexpected-character-in-unquoted-attribute-value': false }]
    },
    {
      code: '<template><div =foo></template>',
      options: [{ 'unexpected-equals-sign-before-attribute-name': false }]
    },
    {
      code: '<template>\u0000</template>',
      options: [{ 'unexpected-null-character': false }]
    },
    {
      code: '<template><?xml?></template>',
      options: [{ 'unexpected-question-mark-instead-of-tag-name': false }]
    },
    {
      code: '<template><div id="" / class=""></template>',
      options: [{ 'unexpected-solidus-in-tag': false }]
    },
    {
      code: '<template>&unknown;</template>',
      options: [{ 'unknown-named-character-reference': false }]
    },
    {
      code: '<template><div></div id=""></template>',
      options: [{ 'end-tag-with-attributes': false }]
    },
    {
      code: '<template><div id="" id=""></div></template>',
      options: [{ 'duplicate-attribute': false }]
    },
    {
      code: '<template><div></div/></template>',
      options: [{ 'end-tag-with-trailing-solidus': false }]
    },
    {
      code: '<template><div/></template>',
      options: [
        { 'non-void-html-element-start-tag-with-trailing-solidus': false }
      ]
    },
    {
      code: '<template></div></template>',
      options: [{ 'x-invalid-end-tag': false }]
    },
    {
      code: '<template><div xmlns=""></template>',
      options: [{ 'x-invalid-namespace': false }]
    },
    '<template><div/></template>',
    '<template><div v-show="">hello</div></template>',
    '<template><div>{{ }}</div></template>',

    // https://github.com/vuejs/eslint-plugin-vue/issues/1403
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p>
            <Address
              value=""
              onchange="await setTokenAddress(event.target.value)"/>
          </p>
        </div>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template>{{a b c}}</template>',
      errors: [
        {
          message: 'Parsing error: Unexpected token b.',
          line: 1,
          column: 15,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{a b c}}</div></template>',
      errors: [
        {
          message: 'Parsing error: Unexpected token b.',
          line: 1,
          column: 20,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="a b c">hello</div></template>',
      errors: [
        {
          message: 'Parsing error: Unexpected token b.',
          line: 1,
          column: 26,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="a;b;">hello</div></template>',
      errors: [
        {
          message: 'Parsing error: Unexpected token ;.',
          line: 1,
          column: 25,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show=" ">hello</div></template>',
      errors: [
        {
          message:
            'Parsing error: Expected to be an expression, but got empty.',
          line: 1,
          column: 24,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="foo">hello</div></template>',
      errors: [
        {
          message: 'Parsing error: Expected to be an alias, but got empty.',
          line: 1,
          column: 23,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="foo() in list">hello</div></template>',
      errors: [
        {
          message: 'Parsing error: Unexpected token (.',
          line: 1,
          column: 26,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<template><!--></template>`,
      options: [{ 'abrupt-closing-of-empty-comment': true }],
      errors: [
        {
          message: 'Parsing error: abrupt-closing-of-empty-comment.',
          line: 1,
          column: 15,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<template><!---></template>`,
      options: [{ 'abrupt-closing-of-empty-comment': true }],
      errors: [
        {
          message: 'Parsing error: abrupt-closing-of-empty-comment.',
          line: 1,
          column: 16,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<template>&#qux;</template>`,
      options: [{ 'absence-of-digits-in-numeric-character-reference': true }],
      errors: [
        {
          message:
            'Parsing error: absence-of-digits-in-numeric-character-reference.',
          line: 1,
          column: 13,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><![CDATA[cdata]]></template>',
      options: [{ 'cdata-in-html-content': true }],
      errors: [
        {
          message: 'Parsing error: cdata-in-html-content.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#1234567;</template>',
      options: [{ 'character-reference-outside-unicode-range': true }],
      errors: [
        {
          message: 'Parsing error: character-reference-outside-unicode-range.',
          line: 1,
          column: 21,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\u0003</template>',
      options: [{ 'control-character-in-input-stream': true }],
      errors: [
        {
          message: 'Parsing error: control-character-in-input-stream.',
          line: 1,
          column: 10,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#0003;</template>',
      options: [{ 'control-character-reference': true }],
      errors: [
        {
          message: 'Parsing error: control-character-reference.',
          line: 1,
          column: 18,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><',
      options: [{ 'eof-before-tag-name': true }],
      errors: [
        {
          message: 'Parsing error: eof-before-tag-name.',
          line: 1,
          column: 12,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><svg><![CDATA[cdata',
      options: [{ 'eof-in-cdata': true }],
      errors: [
        {
          message: 'Parsing error: eof-in-cdata.',
          line: 1,
          column: 30,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!--comment',
      options: [{ 'eof-in-comment': true }],
      errors: [
        {
          message: 'Parsing error: eof-in-comment.',
          line: 1,
          column: 22,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div class=""',
      options: [{ 'eof-in-tag': true }],
      errors: [
        {
          message: 'Parsing error: eof-in-tag.',
          line: 1,
          column: 24,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!--comment--!></template>',
      options: [{ 'incorrectly-closed-comment': true }],
      errors: [
        {
          message: 'Parsing error: incorrectly-closed-comment.',
          line: 1,
          column: 25,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!ELEMENT br EMPTY></template>',
      options: [{ 'incorrectly-opened-comment': true }],
      errors: [
        {
          message: 'Parsing error: incorrectly-opened-comment.',
          line: 1,
          column: 13,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><👍>/template>',
      options: [{ 'invalid-first-character-of-tag-name': true }],
      errors: [
        {
          message: 'Parsing error: invalid-first-character-of-tag-name.',
          line: 1,
          column: 12,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id=></template>',
      options: [{ 'missing-attribute-value': true }],
      errors: [
        {
          message: 'Parsing error: missing-attribute-value.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template></></template>',
      options: [{ 'missing-end-tag-name': true }],
      errors: [
        {
          message: 'Parsing error: missing-end-tag-name.',
          line: 1,
          column: 13,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&amp</template>',
      options: [{ 'missing-semicolon-after-character-reference': true }],
      errors: [
        {
          message:
            'Parsing error: missing-semicolon-after-character-reference.',
          line: 1,
          column: 14,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id="foo"class="bar"></template>',
      options: [{ 'missing-whitespace-between-attributes': true }],
      errors: [
        {
          message: 'Parsing error: missing-whitespace-between-attributes.',
          line: 1,
          column: 24,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!--a<!--b--></template>',
      options: [{ 'nested-comment': true }],
      errors: [
        {
          message: 'Parsing error: nested-comment.',
          line: 1,
          column: 20,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#xFFFE;</template>',
      options: [{ 'noncharacter-character-reference': true }],
      errors: [
        {
          message: 'Parsing error: noncharacter-character-reference.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\uFFFE</template>',
      options: [{ 'noncharacter-in-input-stream': true }],
      errors: [
        {
          message: 'Parsing error: noncharacter-in-input-stream.',
          line: 1,
          column: 10,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#0000;</template>',
      options: [{ 'null-character-reference': true }],
      errors: [
        {
          message: 'Parsing error: null-character-reference.',
          line: 1,
          column: 18,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#xD800;</template>',
      options: [{ 'surrogate-character-reference': true }],
      errors: [
        {
          message: 'Parsing error: surrogate-character-reference.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\uD800</template>',
      options: [{ 'surrogate-in-input-stream': true }],
      errors: [
        {
          message: 'Parsing error: surrogate-in-input-stream.',
          line: 1,
          column: 10,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div a"bc=""></template>',
      options: [{ 'unexpected-character-in-attribute-name': true }],
      errors: [
        {
          message: 'Parsing error: unexpected-character-in-attribute-name.',
          line: 1,
          column: 17,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div foo=bar"></template>',
      options: [{ 'unexpected-character-in-unquoted-attribute-value': true }],
      errors: [
        {
          message:
            'Parsing error: unexpected-character-in-unquoted-attribute-value.',
          line: 1,
          column: 23,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div =foo></template>',
      options: [{ 'unexpected-equals-sign-before-attribute-name': true }],
      errors: [
        {
          message:
            'Parsing error: unexpected-equals-sign-before-attribute-name.',
          line: 1,
          column: 16,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\u0000</template>',
      options: [{ 'unexpected-null-character': true }],
      errors: [
        {
          message: 'Parsing error: unexpected-null-character.',
          line: 1,
          column: 11,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><?xml?></template>',
      options: [{ 'unexpected-question-mark-instead-of-tag-name': true }],
      errors: [
        {
          message:
            'Parsing error: unexpected-question-mark-instead-of-tag-name.',
          line: 1,
          column: 12,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id="" / class=""></template>',
      options: [{ 'unexpected-solidus-in-tag': true }],
      errors: [
        {
          message: 'Parsing error: unexpected-solidus-in-tag.',
          line: 1,
          column: 23,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&unknown;</template>',
      options: [{ 'unknown-named-character-reference': true }],
      errors: [
        {
          message: 'Parsing error: unknown-named-character-reference.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div></div id=""></template>',
      options: [{ 'end-tag-with-attributes': true }],
      errors: [
        {
          message: 'Parsing error: end-tag-with-attributes.',
          line: 1,
          column: 22,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id="" id=""></div></template>',
      options: [{ 'duplicate-attribute': true }],
      errors: [
        {
          message: 'Parsing error: duplicate-attribute.',
          line: 1,
          column: 22,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div></div/></template>',
      options: [{ 'end-tag-with-trailing-solidus': true }],
      errors: [
        {
          message: 'Parsing error: end-tag-with-trailing-solidus.',
          line: 1,
          column: 21,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div/></template>',
      options: [
        { 'non-void-html-element-start-tag-with-trailing-solidus': true }
      ],
      errors: [
        {
          message:
            'Parsing error: non-void-html-element-start-tag-with-trailing-solidus.',
          line: 1,
          column: 11,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template></div></template>',
      options: [{ 'x-invalid-end-tag': true }],
      errors: [
        {
          message: 'Parsing error: x-invalid-end-tag.',
          line: 1,
          column: 11,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div xmlns=""></template>',
      options: [{ 'x-invalid-namespace': true }],
      errors: [
        {
          message: 'Parsing error: x-invalid-namespace.',
          line: 1,
          column: 16,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<template><!--></template>`,
      errors: [
        {
          message: 'Parsing error: abrupt-closing-of-empty-comment.',
          line: 1,
          column: 15,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<template><!---></template>`,
      errors: [
        {
          message: 'Parsing error: abrupt-closing-of-empty-comment.',
          line: 1,
          column: 16,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: `<template>&#qux;</template>`,
      errors: [
        {
          message:
            'Parsing error: absence-of-digits-in-numeric-character-reference.',
          line: 1,
          column: 13,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><![CDATA[cdata]]></template>',
      errors: [
        {
          message: 'Parsing error: cdata-in-html-content.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#1234567;</template>',
      errors: [
        {
          message: 'Parsing error: character-reference-outside-unicode-range.',
          line: 1,
          column: 21,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\u0003</template>',
      errors: [
        {
          message: 'Parsing error: control-character-in-input-stream.',
          line: 1,
          column: 10,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#0003;</template>',
      errors: [
        {
          message: 'Parsing error: control-character-reference.',
          line: 1,
          column: 18,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><',
      errors: [
        {
          message: 'Parsing error: eof-before-tag-name.',
          line: 1,
          column: 12,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><svg><![CDATA[cdata',
      errors: [
        {
          message: 'Parsing error: eof-in-cdata.',
          line: 1,
          column: 30,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!--comment',
      errors: [
        {
          message: 'Parsing error: eof-in-comment.',
          line: 1,
          column: 22,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div class=""',
      errors: [
        {
          message: 'Parsing error: eof-in-tag.',
          line: 1,
          column: 24,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!--comment--!></template>',
      errors: [
        {
          message: 'Parsing error: incorrectly-closed-comment.',
          line: 1,
          column: 25,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!ELEMENT br EMPTY></template>',
      errors: [
        {
          message: 'Parsing error: incorrectly-opened-comment.',
          line: 1,
          column: 13,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><👍>/template>',
      errors: [
        {
          message: 'Parsing error: invalid-first-character-of-tag-name.',
          line: 1,
          column: 12,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id=></template>',
      errors: [
        {
          message: 'Parsing error: missing-attribute-value.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template></></template>',
      errors: [
        {
          message: 'Parsing error: missing-end-tag-name.',
          line: 1,
          column: 13,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&amp</template>',
      errors: [
        {
          message:
            'Parsing error: missing-semicolon-after-character-reference.',
          line: 1,
          column: 14,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id="foo"class="bar"></template>',
      errors: [
        {
          message: 'Parsing error: missing-whitespace-between-attributes.',
          line: 1,
          column: 24,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><!--a<!--b--></template>',
      errors: [
        {
          message: 'Parsing error: nested-comment.',
          line: 1,
          column: 20,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#xFFFE;</template>',
      errors: [
        {
          message: 'Parsing error: noncharacter-character-reference.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\uFFFE</template>',
      errors: [
        {
          message: 'Parsing error: noncharacter-in-input-stream.',
          line: 1,
          column: 10,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#0000;</template>',
      errors: [
        {
          message: 'Parsing error: null-character-reference.',
          line: 1,
          column: 18,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&#xD800;</template>',
      errors: [
        {
          message: 'Parsing error: surrogate-character-reference.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\uD800</template>',
      errors: [
        {
          message: 'Parsing error: surrogate-in-input-stream.',
          line: 1,
          column: 10,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div a"bc=""></template>',
      errors: [
        {
          message: 'Parsing error: unexpected-character-in-attribute-name.',
          line: 1,
          column: 17,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div foo=bar"></template>',
      errors: [
        {
          message:
            'Parsing error: unexpected-character-in-unquoted-attribute-value.',
          line: 1,
          column: 23,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div =foo></template>',
      errors: [
        {
          message:
            'Parsing error: unexpected-equals-sign-before-attribute-name.',
          line: 1,
          column: 16,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>\u0000</template>',
      errors: [
        {
          message: 'Parsing error: unexpected-null-character.',
          line: 1,
          column: 11,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><?xml?></template>',
      errors: [
        {
          message:
            'Parsing error: unexpected-question-mark-instead-of-tag-name.',
          line: 1,
          column: 12,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id="" / class=""></template>',
      errors: [
        {
          message: 'Parsing error: unexpected-solidus-in-tag.',
          line: 1,
          column: 23,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template>&unknown;</template>',
      errors: [
        {
          message: 'Parsing error: unknown-named-character-reference.',
          line: 1,
          column: 19,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div></div id=""></template>',
      errors: [
        {
          message: 'Parsing error: end-tag-with-attributes.',
          line: 1,
          column: 22,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div id="" id=""></div></template>',
      errors: [
        {
          message: 'Parsing error: duplicate-attribute.',
          line: 1,
          column: 22,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div></div/></template>',
      errors: [
        {
          message: 'Parsing error: end-tag-with-trailing-solidus.',
          line: 1,
          column: 21,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template></div></template>',
      errors: [
        {
          message: 'Parsing error: x-invalid-end-tag.',
          line: 1,
          column: 11,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },
    {
      code: '<template><div xmlns=""></template>',
      errors: [
        {
          message: 'Parsing error: x-invalid-namespace.',
          line: 1,
          column: 16,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    },

    //style vars
    {
      filename: 'test.vue',
      code: `
        <template></template>
        <style>
          .text {
            color: v-bind(color.);
            font-size: v-bind('font size');
          }
        </style>
        `,
      errors: [
        {
          message: 'Parsing error: Unexpected end of expression.',
          line: 5,
          column: 33,
          endLine: undefined,
          endColumn: undefined
        },
        {
          message: 'Parsing error: Unexpected token size.',
          line: 6,
          column: 37,
          endLine: undefined,
          endColumn: undefined
        }
      ]
    }
  ]
})
