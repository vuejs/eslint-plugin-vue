---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-arrow-functions-in-watch
description: disallow using arrow functions to define watcher
since: v7.0.0
---

# vue/no-arrow-functions-in-watch

> disallow using arrow functions to define watcher

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule disallows using arrow functions when defining a watcher. Arrow functions bind to their parent context, which means they will not have access to the Vue component instance via `this`. [See here for more details](https://vuejs.org/api/options-state.html#watch).

<eslint-code-block :rules="{'vue/no-arrow-functions-in-watch': ['error']}">

```vue
<script>
export default {
  watch: {
    /* ✓ GOOD */
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    b: 'someMethod',
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    d: {
      handler: 'someMethod',
      immediate: true
    },
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    'e.f': function (val, oldVal) { /* ... */ },

    /* ✗ BAD */
    foo: (val, oldVal) => {
      console.log('new: %s, old: %s', val, oldVal)
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-arrow-functions-in-watch.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-arrow-functions-in-watch.js)
