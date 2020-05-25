/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester } = require('eslint')
const rule = require('../../../lib/rules/no-extra-parens')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-extra-parens', rule, {
  valid: [
    `<template>
      <button
        :class="{
          a: b || c,
          [d + e]: f
        }"
      />
    </template>`,
    `<template>
      <button
        :class="a + b + c * d"
        :class="[a + b + c * d]"
      />
    </template>`,
    `<template>
      <button
        :[(a+b)+c]="foo"
      />
    </template>`,
    `<template>
      <button
        :[(a+b)]="foo"
      />
    </template>`,

    '<template><button :class="(a+b | bitwise)" /></template>',
    '<template><button>{{ (foo + bar | bitwise) }}</button></template>',
    '<template><button>{{ (foo | bitwise) | filter }}</button></template>',
    '<template><button>{{ (function () {} ()) }}</button></template>'
  ],
  invalid: [
    {
      code: `
      <template>
        <button
          :class="a + b + (c * d)"
          :class="[a + b + (c * d)]"
        />
      </template>`,
      output: `
      <template>
        <button
          :class="a + b + c * d"
          :class="[a + b + c * d]"
        />
      </template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 4
        },
        {
          messageId: 'unexpected',
          line: 5
        }
      ]
    },
    {
      code: `
      <template>
        <button
          :class="{
            a: (b || c),
            // [(d + e)]: f // valid in eslint v6.0
          }"
        />
      </template>`,
      output: `
      <template>
        <button
          :class="{
            a: b || c,
            // [(d + e)]: f // valid in eslint v6.0
          }"
        />
      </template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 5
        }
        // valid in eslint v6.0
        // {
        //   messageId: 'unexpected',
        //   line: 6
        // }
      ]
    },
    {
      code: `
      <template>
        <button
          :class="(a+b)+c"
        />
      </template>`,
      output: `
      <template>
        <button
          :class="a+b+c"
        />
      </template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 4
        }
      ]
    },
    {
      code: '<template><button :class="(a+b)" /></template>',
      output: '<template><button :class="a+b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          column: 27
        }
      ]
    },
    {
      code: '<template><button :class="(a+b) | filter" /></template>',
      output: '<template><button :class="a+b | filter" /></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button :class="((a+b | bitwise))" /></template>',
      output: '<template><button :class="(a+b | bitwise)" /></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button>{{ (foo + bar) }}</button></template>',
      output: '<template><button>{{ foo + bar }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          column: 22
        }
      ]
    },
    {
      code: '<template><button>{{ (foo + bar) | filter }}</button></template>',
      output: '<template><button>{{ foo + bar | filter }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code:
        '<template><button>{{ ((foo + bar | bitwise)) }}</button></template>',
      output:
        '<template><button>{{ (foo + bar | bitwise) }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code:
        '<template><button>{{ ((foo | bitwise)) | filter }}</button></template>',
      output:
        '<template><button>{{ (foo | bitwise) | filter }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button>{{ (foo(bar|bitwise)) }}</button></template>',
      output: '<template><button>{{ foo(bar|bitwise) }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button>{{ ([foo|bitwise]) }}</button></template>',
      output: '<template><button>{{ [foo|bitwise] }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button>{{ ({foo:bar|bitwise}) }}</button></template>',
      output: '<template><button>{{ {foo:bar|bitwise} }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button>{{ ((function () {} ())) }}</button></template>',
      output: '<template><button>{{ (function () {} ()) }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    },
    {
      code: '<template><button>{{ ((function () {})()) }}</button></template>',
      output: '<template><button>{{ (function () {})() }}</button></template>',
      errors: [{ messageId: 'unexpected' }]
    }
  ]
})
