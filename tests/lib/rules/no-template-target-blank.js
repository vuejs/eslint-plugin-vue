/**
 * @fileoverview disallow target="_blank" attribute without rel="noopener noreferrer"
 * @author Sosukesuzuki
 */
'use strict'

const rule = require('../../../lib/rules/no-template-target-blank')

const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-template-target-blank', rule, {
  valid: [
    '<template><a>link</a></template>',
    '<template><a attr>link</a></template>',
    '<template><a target>link</a></template>',
    '<template><a href="https://eslint.vuejs.org">link</a></template>',
    '<template><a :href="link">link</a></template>',
    '<template><a :href="link" target="_blank" rel="noopener noreferrer">link</a></template>',
    '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopener noreferrer">link</a></template>',
    {
      code: '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopener">link</a></template>',
      options: [{ allowReferrer: true }]
    },
    '<template><a href="/foo" target="_blank">link</a></template>',
    '<template><a href="/foo" target="_blank" rel="noopener noreferrer">link</a></template>',
    '<template><a href="foo/bar" target="_blank">link</a></template>',
    '<template><a href="foo/bar" target="_blank" rel="noopener noreferrer">link</a></template>',
    {
      code: '<template><a :href="link" target="_blank">link</a></template>',
      options: [{ enforceDynamicLinks: 'never' }]
    }
  ],
  invalid: [
    {
      code: '<template><a href="https://eslint.vuejs.org" target="_blank">link</a></template>',
      errors: [
        {
          message:
            'Using target="_blank" without rel="noopener noreferrer" is a security risk.',
          suggestions: [
            {
              desc: 'Add `rel="noopener noreferrer"`.',
              output:
                '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopener noreferrer">link</a></template>'
            }
          ]
        }
      ]
    },
    {
      code: '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopenernoreferrer">link</a></template>',
      errors: [
        {
          message:
            'Using target="_blank" without rel="noopener noreferrer" is a security risk.',
          suggestions: [
            {
              desc: 'Change `rel` attribute value to `noopener noreferrer`.',
              output:
                '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopener noreferrer">link</a></template>'
            }
          ]
        }
      ]
    },
    {
      code: '<template><a :href="link" target="_blank" rel=3>link</a></template>',
      errors: [
        {
          message:
            'Using target="_blank" without rel="noopener noreferrer" is a security risk.',
          suggestions: [
            {
              desc: 'Change `rel` attribute value to `noopener noreferrer`.',
              output:
                '<template><a :href="link" target="_blank" rel="noopener noreferrer">link</a></template>'
            }
          ]
        }
      ]
    },
    {
      code: '<template><a :href="link" target="_blank">link</a></template>',
      errors: [
        {
          message:
            'Using target="_blank" without rel="noopener noreferrer" is a security risk.',
          suggestions: [
            {
              desc: 'Add `rel="noopener noreferrer"`.',
              output:
                '<template><a :href="link" target="_blank" rel="noopener noreferrer">link</a></template>'
            }
          ]
        }
      ]
    },
    {
      code: '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopener">link</a></template>',
      errors: [
        {
          message:
            'Using target="_blank" without rel="noopener noreferrer" is a security risk.',
          suggestions: [
            {
              desc: 'Change `rel` attribute value to `noopener noreferrer`.',
              output:
                '<template><a href="https://eslint.vuejs.org" target="_blank" rel="noopener noreferrer">link</a></template>'
            }
          ]
        }
      ]
    }
  ]
})
