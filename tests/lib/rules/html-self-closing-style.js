/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-self-closing-style')
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

tester.run('html-self-closing-style', rule, {
  valid: [
    // default
    '<template><div></div></template>',
    '<template><img></template>',
    '<template><x-test/></template>',
    '<template><svg><path/></svg></template>',
    '<template><math><mspace/></math></template>'

    // Other cases are in `invalid` tests.
  ],
  invalid: [
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
        { message: 'Require self-closing on HTML elements.', line: 2 }
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
        { message: 'Disallow self-closing on HTML elements.', line: 3 }
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
        { message: 'Require self-closing on HTML void elements.', line: 4 }
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
        { message: 'Disallow self-closing on HTML void elements.', line: 5 }
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
        { message: 'Require self-closing on Vue.js custom components.', line: 6 }
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
        { message: 'Disallow self-closing on Vue.js custom components.', line: 7 }
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
        { message: 'Require self-closing on SVG elements.', line: 8 }
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
        { message: 'Disallow self-closing on SVG elements.', line: 9 }
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
        { message: 'Require self-closing on MathML elements.', line: 10 }
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
        { message: 'Disallow self-closing on MathML elements.', line: 11 }
      ]
    }
  ]
})
