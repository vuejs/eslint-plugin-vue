/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-self-closing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser'
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

const anyWith = (opts) => Object.assign(
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
      options: [{ html: { normal: 'always' }}]
    },

    // Invalid EOF
    '<template><div a=">test</div></template>',
    '<template><div><!--test</div></template>'

    // other cases are in `invalid` tests.
  ],
  invalid: [
    // default
    {
      code: '<template><div></div></template>',
      output: '<template><div/></template>',
      errors: ['Require self-closing on HTML elements (<div>).']
    },
    {
      code: '<template><img/></template>',
      output: '<template><img></template>',
      errors: ['Disallow self-closing on HTML void elements (<img/>).']
    },
    {
      code: '<template><x-test></x-test></template>',
      output: '<template><x-test/></template>',
      errors: ['Require self-closing on Vue.js custom components (<x-test>).']
    },
    {
      code: '<template><svg><path></path></svg></template>',
      output: '<template><svg><path/></svg></template>',
      errors: ['Require self-closing on SVG elements (<path>).']
    },
    {
      code: '<template><math><mspace></mspace></math></template>',
      output: '<template><math><mspace/></math></template>',
      errors: ['Require self-closing on MathML elements (<mspace>).']
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
      options: [anyWith({ html: { normal: 'always' }})],
      errors: [
        { message: 'Require self-closing on HTML elements (<div>).', line: 2 }
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
      options: [anyWith({ html: { normal: 'never' }})],
      errors: [
        { message: 'Disallow self-closing on HTML elements (<div/>).', line: 3 }
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
      options: [anyWith({ html: { void: 'always' }})],
      errors: [
        { message: 'Require self-closing on HTML void elements (<img>).', line: 4 }
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
      options: [anyWith({ html: { void: 'never' }})],
      errors: [
        { message: 'Disallow self-closing on HTML void elements (<img/>).', line: 5 }
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
      options: [anyWith({ html: { component: 'always' }})],
      errors: [
        { message: 'Require self-closing on Vue.js custom components (<x-test>).', line: 6 }
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
      options: [anyWith({ html: { component: 'never' }})],
      errors: [
        { message: 'Disallow self-closing on Vue.js custom components (<x-test/>).', line: 7 }
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
        { message: 'Require self-closing on SVG elements (<path>).', line: 8 }
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
        { message: 'Disallow self-closing on SVG elements (<path/>).', line: 9 }
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
        { message: 'Require self-closing on MathML elements (<mspace>).', line: 10 }
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
        { message: 'Disallow self-closing on MathML elements (<mspace/>).', line: 11 }
      ]
    }
  ]
})
