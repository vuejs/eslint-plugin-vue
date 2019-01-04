---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-render-return
description: enforce render function to always return value
---
# vue/require-render-return
> enforce render function to always return value

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

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

## :books: Further reading

- [Guide - Render Functions & JSX](https://vuejs.org/v2/guide/render-function.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-render-return.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-render-return.js)
