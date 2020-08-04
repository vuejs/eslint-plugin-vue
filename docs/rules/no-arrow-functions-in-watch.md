---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-arrow-functions-in-watch
description: disallow using arrow functions to define watcher
---
# vue/no-arrow-functions-in-watch
> disallow using arrow functions to define watcher

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rules disallows using arrow functions to defined watcher.The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect.([see here for more details](https://v3.vuejs.org/api/options-data.html#watch))

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-arrow-functions-in-watch.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-arrow-functions-in-watch.js)
