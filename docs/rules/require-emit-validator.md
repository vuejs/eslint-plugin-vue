---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-emit-validator
description: require type definitions in emits
---
# vue/require-emit-validator

> require type definitions in emits

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in .

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-emit-validator.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-emit-validator.js)
