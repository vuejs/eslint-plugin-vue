---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-emit-validator
description: require type definitions in emits
since: v7.10.0
---
# vue/require-emit-validator

> require type definitions in emits

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule enforces that a `emits` statement contains type definition.

Declaring `emits` with types can bring better maintenance.
Even if using with TypeScript, this can provide better type inference when annotating parameters with types.

<eslint-code-block :rules="{'vue/require-emit-validator': ['error']}">

```vue
<script>
/* ✓ GOOD */
Vue.component('foo', {
  emits: {
    // Emit with arguments
    foo: (payload) => { /* validate payload */ },
    // Emit without parameters
    bar: () => true,
  }
})

/* ✗ BAD */
Vue.component('bar', {
  emits: ['foo']
})

Vue.component('baz', {
  emits: {
    foo: null,
  }
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [API Reference](https://v3.vuejs.org/api/options-data.html#emits)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.10.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-emit-validator.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-emit-validator.js)
