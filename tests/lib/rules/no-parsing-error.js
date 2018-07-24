/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-parsing-error')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
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
      options: [{ 'eof-in-cdata': false }],
      errors: ['Parsing error: eof-in-cdata.']
    },
    {
      code: '<template><!--comment',
      options: [{ 'eof-in-comment': false }],
      errors: ['Parsing error: eof-in-comment.']
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
      options: [{ 'non-void-html-element-start-tag-with-trailing-solidus': false }]
    },
    {
      code: '<template></div></template>',
      options: [{ 'x-invalid-end-tag': false }],
      errors: ['Parsing error: x-invalid-end-tag.']
    },
    {
      code: '<template><div xmlns=""></template>',
      options: [{ 'x-invalid-namespace': false }]
    },
    '<template><div/></template>',
    '<template><div v-show="">hello</div></template>',
    '<template><div>{{ }}</div></template>'
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template>{{a b c}}</template>',
      errors: ['Parsing error: Unexpected token b.']
    },
    {
      filename: 'test.vue',
      code: '<template><div>{{a b c}}</div></template>',
      errors: ['Parsing error: Unexpected token b.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="a b c">hello</div></template>',
      errors: ['Parsing error: Unexpected token b.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="a;b;">hello</div></template>',
      errors: ['Parsing error: Unexpected token ;.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show=" ">hello</div></template>',
      errors: [
        { message: 'Parsing error: Expected to be an expression, but got empty.', column: 24 }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="foo">hello</div></template>',
      errors: [
        { message: 'Parsing error: Unexpected end of expression.', column: 26 }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="foo() in list">hello</div></template>',
      errors: [
        { message: 'Parsing error: Unexpected token (.', column: 26 }
      ]
    },
    {
      code: `<template><!--></template>`,
      options: [{ 'abrupt-closing-of-empty-comment': true }],
      errors: ['Parsing error: abrupt-closing-of-empty-comment.']
    },
    {
      code: `<template><!---></template>`,
      options: [{ 'abrupt-closing-of-empty-comment': true }],
      errors: ['Parsing error: abrupt-closing-of-empty-comment.']
    },
    {
      code: `<template>&#qux;</template>`,
      options: [{ 'absence-of-digits-in-numeric-character-reference': true }],
      errors: ['Parsing error: absence-of-digits-in-numeric-character-reference.']
    },
    {
      code: '<template><![CDATA[cdata]]></template>',
      options: [{ 'cdata-in-html-content': true }],
      errors: ['Parsing error: cdata-in-html-content.']
    },
    {
      code: '<template>&#1234567;</template>',
      options: [{ 'character-reference-outside-unicode-range': true }],
      errors: ['Parsing error: character-reference-outside-unicode-range.']
    },
    {
      code: '<template>\u0003</template>',
      options: [{ 'control-character-in-input-stream': true }],
      errors: ['Parsing error: control-character-in-input-stream.']
    },
    {
      code: '<template>&#0003;</template>',
      options: [{ 'control-character-reference': true }],
      errors: ['Parsing error: control-character-reference.']
    },
    {
      code: '<template><',
      options: [{ 'eof-before-tag-name': true }],
      errors: ['Parsing error: eof-before-tag-name.']
    },
    {
      code: '<template><svg><![CDATA[cdata',
      options: [{ 'eof-in-cdata': true }],
      errors: ['Parsing error: eof-in-cdata.']
    },
    {
      code: '<template><!--comment',
      options: [{ 'eof-in-comment': true }],
      errors: ['Parsing error: eof-in-comment.']
    },
    {
      code: '<template><div class=""',
      options: [{ 'eof-in-tag': true }],
      errors: ['Parsing error: eof-in-tag.']
    },
    {
      code: '<template><!--comment--!></template>',
      options: [{ 'incorrectly-closed-comment': true }],
      errors: ['Parsing error: incorrectly-closed-comment.']
    },
    {
      code: '<template><!ELEMENT br EMPTY></template>',
      options: [{ 'incorrectly-opened-comment': true }],
      errors: ['Parsing error: incorrectly-opened-comment.']
    },
    {
      code: '<template><👍>/template>',
      options: [{ 'invalid-first-character-of-tag-name': true }],
      errors: ['Parsing error: invalid-first-character-of-tag-name.']
    },
    {
      code: '<template><div id=></template>',
      options: [{ 'missing-attribute-value': true }],
      errors: ['Parsing error: missing-attribute-value.']
    },
    {
      code: '<template></></template>',
      options: [{ 'missing-end-tag-name': true }],
      errors: ['Parsing error: missing-end-tag-name.']
    },
    {
      code: '<template>&amp</template>',
      options: [{ 'missing-semicolon-after-character-reference': true }],
      errors: ['Parsing error: missing-semicolon-after-character-reference.']
    },
    {
      code: '<template><div id="foo"class="bar"></template>',
      options: [{ 'missing-whitespace-between-attributes': true }],
      errors: ['Parsing error: missing-whitespace-between-attributes.']
    },
    {
      code: '<template><!--a<!--b--></template>',
      options: [{ 'nested-comment': true }],
      errors: ['Parsing error: nested-comment.']
    },
    {
      code: '<template>&#xFFFE;</template>',
      options: [{ 'noncharacter-character-reference': true }],
      errors: ['Parsing error: noncharacter-character-reference.']
    },
    {
      code: '<template>\uFFFE</template>',
      options: [{ 'noncharacter-in-input-stream': true }],
      errors: ['Parsing error: noncharacter-in-input-stream.']
    },
    {
      code: '<template>&#0000;</template>',
      options: [{ 'null-character-reference': true }],
      errors: ['Parsing error: null-character-reference.']
    },
    {
      code: '<template>&#xD800;</template>',
      options: [{ 'surrogate-character-reference': true }],
      errors: ['Parsing error: surrogate-character-reference.']
    },
    {
      code: '<template>\uD800</template>',
      options: [{ 'surrogate-in-input-stream': true }],
      errors: ['Parsing error: surrogate-in-input-stream.']
    },
    {
      code: '<template><div a"bc=""></template>',
      options: [{ 'unexpected-character-in-attribute-name': true }],
      errors: ['Parsing error: unexpected-character-in-attribute-name.']
    },
    {
      code: '<template><div foo=bar"></template>',
      options: [{ 'unexpected-character-in-unquoted-attribute-value': true }],
      errors: ['Parsing error: unexpected-character-in-unquoted-attribute-value.']
    },
    {
      code: '<template><div =foo></template>',
      options: [{ 'unexpected-equals-sign-before-attribute-name': true }],
      errors: ['Parsing error: unexpected-equals-sign-before-attribute-name.']
    },
    {
      code: '<template>\u0000</template>',
      options: [{ 'unexpected-null-character': true }],
      errors: ['Parsing error: unexpected-null-character.']
    },
    {
      code: '<template><?xml?></template>',
      options: [{ 'unexpected-question-mark-instead-of-tag-name': true }],
      errors: ['Parsing error: unexpected-question-mark-instead-of-tag-name.']
    },
    {
      code: '<template><div id="" / class=""></template>',
      options: [{ 'unexpected-solidus-in-tag': true }],
      errors: ['Parsing error: unexpected-solidus-in-tag.']
    },
    {
      code: '<template>&unknown;</template>',
      options: [{ 'unknown-named-character-reference': true }],
      errors: ['Parsing error: unknown-named-character-reference.']
    },
    {
      code: '<template><div></div id=""></template>',
      options: [{ 'end-tag-with-attributes': true }],
      errors: ['Parsing error: end-tag-with-attributes.']
    },
    {
      code: '<template><div id="" id=""></div></template>',
      options: [{ 'duplicate-attribute': true }],
      errors: ['Parsing error: duplicate-attribute.']
    },
    {
      code: '<template><div></div/></template>',
      options: [{ 'end-tag-with-trailing-solidus': true }],
      errors: ['Parsing error: end-tag-with-trailing-solidus.']
    },
    {
      code: '<template><div/></template>',
      options: [{ 'non-void-html-element-start-tag-with-trailing-solidus': true }],
      errors: ['Parsing error: non-void-html-element-start-tag-with-trailing-solidus.']
    },
    {
      code: '<template></div></template>',
      options: [{ 'x-invalid-end-tag': true }],
      errors: ['Parsing error: x-invalid-end-tag.']
    },
    {
      code: '<template><div xmlns=""></template>',
      options: [{ 'x-invalid-namespace': true }],
      errors: ['Parsing error: x-invalid-namespace.']
    },
    {
      code: `<template><!--></template>`,
      errors: ['Parsing error: abrupt-closing-of-empty-comment.']
    },
    {
      code: `<template><!---></template>`,
      errors: ['Parsing error: abrupt-closing-of-empty-comment.']
    },
    {
      code: `<template>&#qux;</template>`,
      errors: ['Parsing error: absence-of-digits-in-numeric-character-reference.']
    },
    {
      code: '<template><![CDATA[cdata]]></template>',
      errors: ['Parsing error: cdata-in-html-content.']
    },
    {
      code: '<template>&#1234567;</template>',
      errors: ['Parsing error: character-reference-outside-unicode-range.']
    },
    {
      code: '<template>\u0003</template>',
      errors: ['Parsing error: control-character-in-input-stream.']
    },
    {
      code: '<template>&#0003;</template>',
      errors: ['Parsing error: control-character-reference.']
    },
    {
      code: '<template><',
      errors: ['Parsing error: eof-before-tag-name.']
    },
    {
      code: '<template><svg><![CDATA[cdata',
      errors: ['Parsing error: eof-in-cdata.']
    },
    {
      code: '<template><!--comment',
      errors: ['Parsing error: eof-in-comment.']
    },
    {
      code: '<template><div class=""',
      errors: ['Parsing error: eof-in-tag.']
    },
    {
      code: '<template><!--comment--!></template>',
      errors: ['Parsing error: incorrectly-closed-comment.']
    },
    {
      code: '<template><!ELEMENT br EMPTY></template>',
      errors: ['Parsing error: incorrectly-opened-comment.']
    },
    {
      code: '<template><👍>/template>',
      errors: ['Parsing error: invalid-first-character-of-tag-name.']
    },
    {
      code: '<template><div id=></template>',
      errors: ['Parsing error: missing-attribute-value.']
    },
    {
      code: '<template></></template>',
      errors: ['Parsing error: missing-end-tag-name.']
    },
    {
      code: '<template>&amp</template>',
      errors: ['Parsing error: missing-semicolon-after-character-reference.']
    },
    {
      code: '<template><div id="foo"class="bar"></template>',
      errors: ['Parsing error: missing-whitespace-between-attributes.']
    },
    {
      code: '<template><!--a<!--b--></template>',
      errors: ['Parsing error: nested-comment.']
    },
    {
      code: '<template>&#xFFFE;</template>',
      errors: ['Parsing error: noncharacter-character-reference.']
    },
    {
      code: '<template>\uFFFE</template>',
      errors: ['Parsing error: noncharacter-in-input-stream.']
    },
    {
      code: '<template>&#0000;</template>',
      errors: ['Parsing error: null-character-reference.']
    },
    {
      code: '<template>&#xD800;</template>',
      errors: ['Parsing error: surrogate-character-reference.']
    },
    {
      code: '<template>\uD800</template>',
      errors: ['Parsing error: surrogate-in-input-stream.']
    },
    {
      code: '<template><div a"bc=""></template>',
      errors: ['Parsing error: unexpected-character-in-attribute-name.']
    },
    {
      code: '<template><div foo=bar"></template>',
      errors: ['Parsing error: unexpected-character-in-unquoted-attribute-value.']
    },
    {
      code: '<template><div =foo></template>',
      errors: ['Parsing error: unexpected-equals-sign-before-attribute-name.']
    },
    {
      code: '<template>\u0000</template>',
      errors: ['Parsing error: unexpected-null-character.']
    },
    {
      code: '<template><?xml?></template>',
      errors: ['Parsing error: unexpected-question-mark-instead-of-tag-name.']
    },
    {
      code: '<template><div id="" / class=""></template>',
      errors: ['Parsing error: unexpected-solidus-in-tag.']
    },
    {
      code: '<template>&unknown;</template>',
      errors: ['Parsing error: unknown-named-character-reference.']
    },
    {
      code: '<template><div></div id=""></template>',
      errors: ['Parsing error: end-tag-with-attributes.']
    },
    {
      code: '<template><div id="" id=""></div></template>',
      errors: ['Parsing error: duplicate-attribute.']
    },
    {
      code: '<template><div></div/></template>',
      errors: ['Parsing error: end-tag-with-trailing-solidus.']
    },
    {
      code: '<template></div></template>',
      errors: ['Parsing error: x-invalid-end-tag.']
    },
    {
      code: '<template><div xmlns=""></template>',
      errors: ['Parsing error: x-invalid-namespace.']
    }
  ]
})
