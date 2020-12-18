---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-functional-template
description: disallow using deprecated the `functional` template (in Vue.js 3.0.0+)
---
# vue/no-deprecated-functional-template
> disallow using deprecated the `functional` template (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports deprecated the `functional` template (in Vue.js 3.0.0+)

<eslint-code-block :rules="{'vue/no-deprecated-functional-template': ['error']}">

```vue
<!-- ✗ BAD -->
<template functional>
  <!-- ... -->
</template>
```

</eslint-code-block>

### :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0007-functional-async-api-change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0007-functional-async-api-change.md)
- [Guide - Functional Components](https://vuejs.org/v2/guide/render-function.html#Functional-Components)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-functional-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-functional-template.js)
