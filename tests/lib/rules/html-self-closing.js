/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/html-self-closing')
const RuleTester = require('../../eslint-compat').RuleTester

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser') }
})

const ALL_CODE = `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`

const anyWith = (opts) =>
  Object.assign(
    {
      svg: 'any',
      math: 'any'
    },
    opts,
    {
      html: Object.assign(
        {
          normal: 'any',
          void: 'any',
          component: 'any'
        },
        opts.html || {}
      )
    }
  )

tester.run('html-self-closing', rule, {
  valid: [
    // default
    '<template><div/></template>',
    '<template><img></template>',
    '<template><x-test/></template>',
    '<template><svg><path/></svg></template>',
    '<template><math><mspace/></math></template>',

    // Don't error if there are comments in their content.
    {
      code: '<template><div><!-- comment --></div></template>',
      output: null,
      options: [{ html: { normal: 'always' } }]
    },

    // Invalid EOF
    '<template><div a=">test</div></template>',
    '<template><div><!--test</div></template>',

    // Empty top-level tags
    '<template></template><script></script><docs></docs>',

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

    // other cases are in `invalid` tests.
  ],
  invalid: [
    // default
    {
      code: '<template><div></div></template>',
      output: '<template><div/></template>',
      errors: [
        {
          message: 'Require self-closing on HTML elements (<div>).',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: '<template><img/></template>',
      output: '<template><img></template>',
      errors: [
        {
          message: 'Disallow self-closing on HTML void elements (<img/>).',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: '<template><x-test></x-test></template>',
      output: '<template><x-test/></template>',
      errors: [
        {
          message:
            'Require self-closing on Vue.js custom components (<x-test>).',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: '<template><svg><path></path></svg></template>',
      output: '<template><svg><path/></svg></template>',
      errors: [
        {
          message: 'Require self-closing on SVG elements (<path>).',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: '<template><math><mspace></mspace></math></template>',
      output: '<template><math><mspace/></math></template>',
      errors: [
        {
          message: 'Require self-closing on MathML elements (<mspace>).',
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 34
        }
      ]
    },

    // others
    {
      code: ALL_CODE,
      output: `<template>
  <div/>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ html: { normal: 'always' } })],
      errors: [
        {
          message: 'Require self-closing on HTML elements (<div>).',
          line: 2,
          column: 8,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div></div>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ html: { normal: 'never' } })],
      errors: [
        {
          message: 'Disallow self-closing on HTML elements (<div/>).',
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 9
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img/>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ html: { void: 'always' } })],
      errors: [
        {
          message: 'Require self-closing on HTML void elements (<img>).',
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 8
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ html: { void: 'never' } })],
      errors: [
        {
          message: 'Disallow self-closing on HTML void elements (<img/>).',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 9
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test/>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ html: { component: 'always' } })],
      errors: [
        {
          message:
            'Require self-closing on Vue.js custom components (<x-test>).',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 20
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test></x-test>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ html: { component: 'never' } })],
      errors: [
        {
          message:
            'Disallow self-closing on Vue.js custom components (<x-test/>).',
          line: 7,
          column: 10,
          endLine: 7,
          endColumn: 12
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path/></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ svg: 'always' })],
      errors: [
        {
          message: 'Require self-closing on SVG elements (<path>).',
          line: 8,
          column: 14,
          endLine: 8,
          endColumn: 21
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path></path></svg>
  <math><mspace></mspace></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ svg: 'never' })],
      errors: [
        {
          message: 'Disallow self-closing on SVG elements (<path/>).',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 15
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace/></math>
  <math><mspace/></math>
</template>`,
      options: [anyWith({ math: 'always' })],
      errors: [
        {
          message: 'Require self-closing on MathML elements (<mspace>).',
          line: 10,
          column: 17,
          endLine: 10,
          endColumn: 26
        }
      ]
    },
    {
      code: ALL_CODE,
      output: `<template>
  <div></div>
  <div/>
  <img>
  <img/>
  <x-test></x-test>
  <x-test/>
  <svg><path></path></svg>
  <svg><path/></svg>
  <math><mspace></mspace></math>
  <math><mspace></mspace></math>
</template>`,
      options: [anyWith({ math: 'never' })],
      errors: [
        {
          message: 'Disallow self-closing on MathML elements (<mspace/>).',
          line: 11,
          column: 16,
          endLine: 11,
          endColumn: 18
        }
      ]
    }
  ]
})
