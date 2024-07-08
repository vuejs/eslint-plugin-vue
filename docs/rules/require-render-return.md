---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-render-return
description: enforce render function to always return value
since: v3.10.0
---

# vue/require-render-return

> enforce render function to always return value

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue3-recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule aims to enforce render function to always return value

<eslint-code-block :rules="{'vue/require-render-return': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  render(h) {
    return h('div', 'hello')
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-render-return': ['error']}">

```vue
<script>
export default {
  /* ✗ BAD */
  render(h) {
    if (foo) {
      return h('div', 'hello')
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Render Functions](https://vuejs.org/guide/extras/render-function.html)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.10.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-render-return.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-render-return.js)
