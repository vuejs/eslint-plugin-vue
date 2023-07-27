/**
 * @author Perry Song
 * @copyright 2023 Perry Song. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-root-v-if')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-root-v-if', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div>abc</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <div>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <!-- comment -->\n    <div>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <!-- comment -->\n    <div v-if="foo">abc</div>\n    <div v-else>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <!-- comment -->\n    <div v-if="foo">abc</div>\n    <div v-else-if="bar">abc</div>\n    <div v-else>abc</div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: `<template>\n    <c1 v-if="1" />\n    <c2 v-else-if="1" />\n    <c3 v-else />\n</template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo"></div><div v-else-if="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template src="foo.html"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><textarea/>test</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><table><custom-thead></custom-thead></table></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div></div><div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template>\n    <div></div>\n    <div></div>\n</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>{{a b c}}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div></div>aaaaaa</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>aaaaaa<div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in list"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><slot></slot></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><template></template></template>'
    },
    {
      filename: 'test.vue',
      code: '<template> <div v-if="mode === \'a\'"></div><div v-if="mode === \'b\'"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div /><div v-if="foo" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><custom-component v-if="foo"></custom-component></template>',
      errors: ['`v-if` should not be used on root element without `v-else`.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="foo"></div></template>',
      errors: ['`v-if` should not be used on root element without `v-else`.']
    }
  ]
})
