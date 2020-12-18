---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-render-return
description: enforce render function to always return value
---
# vue/require-render-return
> enforce render function to always return value

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule aims to enforce render function to always return value

<eslint-code-block :rules="{'vue/require-render-return': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  render (h) {
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
  render (h) {
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

- [Guide - Render Functions](https://v3.vuejs.org/guide/render-function.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-render-return.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-render-return.js)
