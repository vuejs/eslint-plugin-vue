---
pageClass: rule-details
sidebarDepth: 0
title: vue/one-component-per-file
description: enforce that each component should be in its own file
---
# vue/one-component-per-file
> enforce that each component should be in its own file

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule checks if there is only one component per file.

<eslint-code-block filename="a.js" language="javascript" :rules="{'vue/one-component-per-file': ['error']}">

```js
/* ✗ BAD */

Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/one-component-per-file': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  name: 'my-component'
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Style guide - Component files](https://v3.vuejs.org/style-guide/#component-files-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/one-component-per-file.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/one-component-per-file.js)
