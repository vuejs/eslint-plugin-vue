---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-require-false
description: disallow require: false on props
---
# vue/no-require-false
> disallow require: false on props

- :gear: This rule is included in `"plugin:vue/recommended"`.

## :book: Rule Details

This rule report usage of require: false on props.

<eslint-code-block :rules="{'vue/no-require-false': ['error']}">
```
<script>
/* ✗ BAD */
export default {
  props: {
    foo: String,
    require: false
  },
}
/* ✗ GOOD */
export default {
  props: {
    foo: String
  },
}
</script>
```
</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-dupe-keys.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-dupe-keys.js)
