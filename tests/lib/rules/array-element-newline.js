/**
 * @author alshyra
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/array-element-newline')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('array-element-newline', rule, {
  valid: [
    '<template><div :attr="[]" /></template>',
    '<template><div :attr="[a]" /></template>',
    '<template><div :attr="[a,\nb,\nc]" /></template>',
    '<template><div :attr="[a,\nb,\nc\n]" /></template>',
    '<template><div :attr="[\na,\nb,\nc\n]" /></template>',
    '<template><div :[attr]="a" /></template>',
    '<template><div :[[attr]]="a" /></template>',
    '<template><div :attr="[a\nb]" /></template>',
    {
      code: '<template><div :attr="[a,\nb,\nc]" /></template>',
      options: ['always']
    },
    {
      code: '<template><div :attr="[a]" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="[a,b,c]" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="[a, b, c]" /></template>',
      options: [{ multiline: true }]
    },
    {
      code: '<template><div :attr="[a, \n{\nb:c\n}]" /></template>',
      options: [{ multiline: true }]
    },
    {
      code: '<template><div :attr="[a, b, c]" /></template>',
      options: ['consistent']
    },
    {
      code: '<template><div :attr="[a,\n b,\n c\n]" /></template>',
      options: ['consistent']
    },
    {
      code: '<template><div :attr="[a,b]" /></template>',
      options: [{ minItems: 3 }]
    }
  ],
  invalid: [
    {
      code: '<template><div :attr="[a, b]" /></template>',
      output: '<template><div :attr="[a,\nb]" /></template>',
      errors: ['There should be a linebreak after this element.']
    },
    {
      code: '<template><div :attr="[a,b,c]" /></template>',
      output: '<template><div :attr="[a,\nb,\nc]" /></template>',
      options: ['always'],
      errors: [
        'There should be a linebreak after this element.',
        'There should be a linebreak after this element.'
      ]
    },
    {
      code: '<template><div :attr="[a,\nb,c]" /></template>',
      output: '<template><div :attr="[a,\nb,\nc]" /></template>',
      options: ['always'],
      errors: ['There should be a linebreak after this element.']
    },
    {
      code: '<template><div :attr="[a,\nb,c]" /></template>',
      output: '<template><div :attr="[a,\nb,\nc]" /></template>',
      options: ['consistent'],
      errors: ['There should be a linebreak after this element.']
    },
    {
      code: '<template><div :attr="[a,\nb, c]" /></template>',
      output: '<template><div :attr="[a, b, c]" /></template>',
      options: [{ multiline: true }],
      errors: ['There should be no linebreak here.']
    },
    {
      code: '<template><div :attr="[a,{\nb:c}]" /></template>',
      output: '<template><div :attr="[a,\n{\nb:c}]" /></template>',
      options: [{ multiline: true }],
      errors: ['There should be a linebreak after this element.']
    },
    {
      code: '<template><div :attr="[a,b,c]" /></template>',
      output: '<template><div :attr="[a,\nb,\nc]" /></template>',
      options: [{ minItems: 2 }],
      errors: [
        'There should be a linebreak after this element.',
        'There should be a linebreak after this element.'
      ]
    }
  ]
})