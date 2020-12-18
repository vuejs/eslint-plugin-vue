---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-dollar-listeners-api
description: disallow using deprecated `$listeners` (in Vue.js 3.0.0+)
---
# vue/no-deprecated-dollar-listeners-api
> disallow using deprecated `$listeners` (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports use of deprecated `$listeners`. (in Vue.js 3.0.0+).

<eslint-code-block :rules="{'vue/no-deprecated-dollar-listeners-api': ['error']}">

```vue
<template>
  <!-- ✗ BAD -->
  <MyInput v-on="$listeners">
</template>
<script>
export default {
  computed: {
    listeners() {
      return {
        /* ✗ BAD */
        ...this.$listeners,
        input() { /* */ }
      }
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0031-attr-fallthrough](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-dollar-listeners-api.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-dollar-listeners-api.js)
