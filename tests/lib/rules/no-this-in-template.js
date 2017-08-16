/**
 * @fileoverview enforce usage of `this` in template.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-this-in-template')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

function createValidTests (prefix, options) {
  return [
    {
      code: `<template><div>{{ ${prefix}foo.bar }}</div></template><!-- ${options.join('')} -->`,
      options
    },
    {
      code: `<template><div v-for="foo in ${prefix}bar">{{ foo }}</div></template><!-- ${options.join('')} -->`,
      options
    },
    {
      code: `<template><div v-if="${prefix}foo">{{ ${prefix}foo }}</div></template><!-- ${options.join('')} -->`,
      options
    },
    {
      code: `<template><div :class="${prefix}foo">{{ ${prefix}foo }}</div></template><!-- ${options.join('')} -->`,
      options
    },
    {
      code: `<template><div :class="{this: ${prefix}foo}">{{ ${prefix}foo }}</div></template><!-- ${options.join('')} -->`,
      options
    },
    {
      code: `<template><div v-for="bar in ${prefix}foo" v-if="bar">{{ bar }}</div></template><!-- ${options.join('')} -->`,
      options
    }
  ]
}

function createInvalidTests (prefix, options, message, type) {
  return [
    {
      code: `<template><div>{{ ${prefix}foo }}</div></template><!-- ${options.join('')} -->`,
      errors: [{ message, type }],
      options
    },
    {
      code: `<template><div :class="${prefix}foo"></div></template><!-- ${options.join('')} -->`,
      errors: [{ message, type }],
      options
    },
    {
      code: `<template><div :class="{foo: ${prefix}foo}"></div></template><!-- ${options.join('')} -->`,
      errors: [{ message, type }],
      options
    },
    {
      code: `<template><div :class="{foo: ${prefix}foo()}"></div></template><!-- ${options.join('')} -->`,
      errors: [{ message, type }],
      options
    },
    {
      code: `<template><div v-if="${prefix}foo"></div></template><!-- ${options.join('')} -->`,
      errors: [{ message, type }],
      options
    },
    {
      code: `<template><div v-for="foo in ${prefix}bar"></div></template><!-- ${options.join('')} -->`,
      errors: [{ message, type }],
      options
    }
  ]
}

ruleTester.run('no-this-in-template', rule, {
  valid: ['', '<template></template>', '<template><div></div></template>']
    .concat(createValidTests('', []))
    .concat(createValidTests('', ['never']))
    .concat(createValidTests('this.', ['always'])),
  invalid: []
    .concat(createInvalidTests('this.', [], "Unexpected usage of 'this'.", 'ThisExpression'))
    .concat(createInvalidTests('this.', ['never'], "Unexpected usage of 'this'.", 'ThisExpression'))
    .concat(createInvalidTests('', ['always'], "Expected 'this'.", 'Identifier'))
})
