/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-irregular-whitespace')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2018 }
})

const IRREGULAR_WHITESPACES = '\f\v\u0085\ufeff\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u202f\u205f\u3000'.split(
  ''
)
const IRREGULAR_LINE_TERMINATORS = '\u2028\u2029'.split('')
const ALL_IRREGULAR_WHITESPACES = [].concat(
  IRREGULAR_WHITESPACES,
  IRREGULAR_LINE_TERMINATORS
)
const ALL_IRREGULAR_WHITESPACE_CODES = ALL_IRREGULAR_WHITESPACES.map((s) =>
  `000${s.charCodeAt(0).toString(16)}`.slice(-4)
)

tester.run('no-irregular-whitespace', rule, {
  valid: [
    'var a = \t\r\n b',
    '<template><div attr=" \t\r\n " :dir=" \t\r\n foo  \t\r\n " > \t\r\n s \t\r\n </div></template><script>var a = \t\r\n b</script>',
    // escapes
    ...ALL_IRREGULAR_WHITESPACE_CODES.map((s) => `/\\u${s}/+'\\u${s}'`),
    // html escapes
    ...ALL_IRREGULAR_WHITESPACE_CODES.map(
      (s) => `<template><div attr="&#x${s}">&#x${s}s&#x${s}</div></template>`
    ),
    // strings
    ...IRREGULAR_WHITESPACES.map((s) => `'${s}'`),
    ...IRREGULAR_LINE_TERMINATORS.map((s) => `'\\${s}'`), // multiline string
    ...IRREGULAR_WHITESPACES.map((s) => `<template>{{ '${s}' }}</template>`),
    // comments
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `//${s}`,
      options: [{ skipComments: true }]
    })),
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `/*${s}*/`,
      options: [{ skipComments: true }]
    })),
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ i//${s}\n }}</div></template>`,
      options: [{ skipComments: true }]
    })),
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ i/*${s}*/ }}</div></template>`,
      options: [{ skipComments: true }]
    })),
    // regexps
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `/${s}/`,
      options: [{ skipRegExps: true }]
    })),
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ /${s}/ }}</div></template>`,
      options: [{ skipRegExps: true }]
    })),
    // templates
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `\`${s}\``,
      options: [{ skipTemplates: true }]
    })),
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ \`${s}\` }}</div></template>`,
      options: [{ skipTemplates: true }]
    })),
    // attribute values
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div attr="${s}" /></template>`,
      options: [{ skipHTMLAttributeValues: true }]
    })),
    // text contents
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>${s}</div></template>`,
      options: [{ skipHTMLTextContents: true }]
    })),
    // outside
    `\u3000<template></template>\u3000<script></script>\u3000<block>\u3000</block>\u3000<style \u3000>\u3000</style>\u3000`
  ],
  invalid: [
    {
      code: `var any \u000B = 'thing';`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 9
        }
      ]
    },
    {
      code: `
      <template>
        \u3000
        <div
          \u3000
          attr="\u3000"
          :dir="\u3000 foo \u3000"
          \u3000>
        \u3000
        </div
        \u3000>
        \u3000
      </template>
      <script>
      var any \u000B = 'thing';
      </script>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 3,
          column: 9
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 5,
          column: 11
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 6,
          column: 17
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 7,
          column: 17
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 7,
          column: 23
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 8,
          column: 11
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 9,
          column: 9
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 11,
          column: 9
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 12,
          column: 9
        },
        {
          message: 'Irregular whitespace not allowed.',
          line: 15,
          column: 15
        }
      ]
    },
    // strings
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `'${s}'`,
      options: [{ skipStrings: false }],
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 2
        }
      ]
    })),
    ...IRREGULAR_LINE_TERMINATORS.map((s) => ({
      code: `'\\${s}'`,
      options: [{ skipStrings: false }],
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 3
        }
      ]
    })),
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template>{{ '${s}' }}</template>`,
      options: [{ skipStrings: false }],
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 15
        }
      ]
    })),
    // comments
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `//${s}`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 3
        }
      ]
    })),
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `/*${s}*/`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 3
        }
      ]
    })),
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ i//${s}\n }}</div></template>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 22
        }
      ]
    })),
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ i/*${s}*/ }}</div></template>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 22
        }
      ]
    })),
    // regexps
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `/${s}/`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 2
        }
      ]
    })),
    ...IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ /${s}/ }}</div></template>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 20
        }
      ]
    })),
    // templates
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `\`${s}\``,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 2
        }
      ]
    })),
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>{{ \`${s}\` }}</div></template>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 20
        }
      ]
    })),
    // attribute values
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div attr="${s}" /></template>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 22
        }
      ]
    })),
    // text contents
    ...ALL_IRREGULAR_WHITESPACES.map((s) => ({
      code: `<template><div>${s}</div></template>`,
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 1,
          column: 16
        }
      ]
    })),
    // options
    {
      code: `
      <template>
        <div attr="\f" attr2=" ">
        \f<div> </div>
        </div>
      </template\f\v>
      <script>
      var a = '\f'
      var b = '\t'
      // \f
      /* comment */
      /* \f */
      var c = /\f/
      var d = / /
      var e = \`\f\`
      var f = \`\\f\`
      </script>`,
      options: [
        {
          skipComments: true,
          skipStrings: true,
          skipTemplates: true,
          skipRegExps: true,
          skipHTMLAttributeValues: true,
          skipHTMLTextContents: true
        }
      ],
      errors: [
        {
          message: 'Irregular whitespace not allowed.',
          line: 6,
          column: 17
        }
      ]
    }
  ]
})
