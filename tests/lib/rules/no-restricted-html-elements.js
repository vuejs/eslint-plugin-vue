/**
 * @author Doug Wade
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-restricted-html-elements')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('no-restricted-html-elements', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
      options: ['button']
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>',
      options: ['button']
    },
    {
      filename: 'test.vue',
      code: '<template><button type="button"></button></template>',
      options: ['div']
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"><Button type="button"></Button></div></template>',
      options: ['button']
    },
    {
      filename: 'test.vue',
      code: '<template><main><article></article></main></template>',
      options: [{ element: ['div', 'span'] }]
    },
    // SVG
    {
      filename: 'test.vue',
      code: '<template><svg><rect width="100" height="100"></rect></svg></template>',
      options: ['circle']
    },
    // Math
    {
      filename: 'test.vue',
      code: '<template><math><mn>2</mn></math></template>',
      options: ['mi']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><button type="button"></button><div></template>',
      options: ['button'],
      errors: [
        {
          message: 'Unexpected use of forbidden element button.',
          line: 1,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"><button type="button"></button></div></template>',
      options: ['div'],
      errors: [
        {
          message: 'Unexpected use of forbidden element div.',
          line: 1,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><marquee>foo</marquee></template>',
      options: [{ element: 'marquee', message: 'Custom error' }],
      errors: [
        {
          message: 'Custom error',
          line: 1,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><a></a><RouterLink></RouterLink></template>',
      options: [
        {
          element: ['a', 'RouterLink'],
          message: 'Prefer the use of <NuxtLink> component'
        }
      ],
      errors: [
        {
          message: 'Prefer the use of <NuxtLink> component',
          line: 1,
          column: 11
        },
        {
          message: 'Prefer the use of <NuxtLink> component',
          line: 1,
          column: 18
        }
      ]
    },
    // SVG
    {
      filename: 'test.vue',
      code: '<template><svg><circle r="50"></circle></svg></template>',
      options: ['circle'],
      errors: [
        {
          message: 'Unexpected use of forbidden element circle.',
          line: 1,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><svg><rect width="100" height="100"></rect><path d="M10,10 L20,20"></path></svg></template>',
      options: [
        { element: ['rect', 'path'], message: 'Use simplified shapes instead' }
      ],
      errors: [
        {
          message: 'Use simplified shapes instead',
          line: 1,
          column: 16
        },
        {
          message: 'Use simplified shapes instead',
          line: 1,
          column: 54
        }
      ]
    },
    // Math
    {
      filename: 'test.vue',
      code: '<template><math><mfrac><mn>1</mn><mn>2</mn></mfrac></math></template>',
      options: ['mfrac'],
      errors: [
        {
          message: 'Unexpected use of forbidden element mfrac.',
          line: 1,
          column: 17
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><math><mi>x</mi><mo>=</mo><mn>5</mn></math></template>',
      options: [{ element: 'mo', message: 'Avoid using operators directly' }],
      errors: [
        {
          message: 'Avoid using operators directly',
          line: 1,
          column: 27
        }
      ]
    }
  ]
})
