/**
 * @fileoverview  Don&#39;t use &#34;this&#34; i a beforeRouteEnter method
 * @author Przemyslaw Jan Beigert
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-this-in-before-route-enter')
const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const template = (beforeRouteEnter) => `
<template>
  <p>{{ greeting }} World!</p>
</template>

<script>
export default {
  data () {
    return {
      greeting: "Hello"
    };
  },
  beforeRouteEnter() {
      ${beforeRouteEnter}
  }
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>`

const functionTemplate = (beforeRouteEnter) => `
<template>
  <p>{{ greeting }} World!</p>
</template>

<script>
export default {
  data () {
    return {
      greeting: "Hello"
    };
  },
  beforeRouteEnter: function() {
      ${beforeRouteEnter}
  }
};
</script>`

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})
ruleTester.run('no-this-in-before-route-enter', rule, {
  valid: [
    template(''),
    template('const variable = 42;'),
    template('someFunction(42)'),
    `
<template>
  <p>{{ greeting }} World!</p>
</template>

<script>
export default {
  data () {
    return {
      greeting: "Hello"
    };
  },
};`
  ],
  invalid: [
    {
      code: template(`this.xxx();`),
      filename: 'ValidComponent.vue',
      errors: [
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 14,
          column: 7,
          endLine: 14,
          endColumn: 11
        }
      ]
    },
    {
      code: functionTemplate('this.method();'),
      filename: 'ValidComponent.vue',
      errors: [
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 14,
          column: 7,
          endLine: 14,
          endColumn: 11
        }
      ]
    },
    {
      code: template('this.attr = this.method();'),
      filename: 'ValidComponent.vue',
      errors: [
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 14,
          column: 7,
          endLine: 14,
          endColumn: 11
        },
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 14,
          column: 19,
          endLine: 14,
          endColumn: 23
        }
      ]
    },
    {
      code: functionTemplate('this.attr = this.method();'),
      filename: 'ValidComponent.vue',
      errors: [
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 14,
          column: 7,
          endLine: 14,
          endColumn: 11
        },
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 14,
          column: 19,
          endLine: 14,
          endColumn: 23
        }
      ]
    },
    {
      code: template(`
                if (this.method()) {}
            `),
      filename: 'ValidComponent.vue',
      errors: [
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 15,
          column: 21,
          endLine: 15,
          endColumn: 25
        }
      ]
    },
    {
      code: functionTemplate(`
                if (true) { this.method(); }
            `),
      filename: 'ValidComponent.vue',
      errors: [
        {
          message:
            "'beforeRouteEnter' does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards.",
          line: 15,
          column: 29,
          endLine: 15,
          endColumn: 33
        }
      ]
    }
  ]
})
