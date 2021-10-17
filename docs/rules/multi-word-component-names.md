---
pageClass: rule-details
sidebarDepth: 0
title: vue/multi-word-component-names
description: require component names to be always multi-word
---
# vue/multi-word-component-names

> require component names to be always multi-word

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule ....

<eslint-code-block :rules="{'vue/multi-word-component-names': ['error']}">

```vue
<template>
/* ✓ GOOD */
Vue.component('todo-item', {
  // ...
})

export default {
  name: 'TodoItem',
  // ...
}

/* ✗ BAD */

Vue.component('todo', {
  // ...
})

export default {
  name: 'Todo',
  // ...
}
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Style guide - Multi-word component names](https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/multi-word-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/multi-word-component-names.js)
