---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-confusing-v-for-v-if
description: disallow confusing `v-for` and `v-if` on the same element
---
# vue/no-confusing-v-for-v-if
> disallow confusing `v-for` and `v-if` on the same element

- :warning: This rule was **deprecated** and replaced by [vue/no-use-v-if-with-v-for](no-use-v-if-with-v-for.md) rule.

## :book: Rule Details

This rule reports the elements which have both `v-for` and `v-if` directives in the following cases:

- The `v-if` directive does not use the reference which is to the variables which are defined by the `v-for` directives.

In that case, the `v-if` should be written on the wrapper element.

<eslint-code-block :rules="{'vue/no-confusing-v-for-v-if': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <TodoItem
    v-for="todo in todos"
    v-if="todo.shown"
    :todo="todo"
  />
  <ul v-if="shown">
    <TodoItem
      v-for="todo in todos"
      :todo="todo"
    />
  </ul>

  <!-- ✗ BAD -->
  <TodoItem
    v-if="complete"
    v-for="todo in todos"
    :todo="todo"
  />
</template>
```

</eslint-code-block>

::: warning Note
When they exist on the same node, `v-for` has a higher priority than `v-if`. That means the `v-if` will be run on each iteration of the loop separately.

[https://vuejs.org/v2/guide/list.html#v-for-with-v-if](https://vuejs.org/v2/guide/list.html#v-for-with-v-if)
:::

## :wrench: Options

Nothing.

## :books: Further reading

- [Style guide - Avoid v-if with v-for](https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential)
- [Guide - Conditional / v-if with v-for](https://vuejs.org/v2/guide/conditional.html#v-if-with-v-for)
- [Guide - List / v-for with v-if](https://vuejs.org/v2/guide/list.html#v-for-with-v-if)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-confusing-v-for-v-if.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-confusing-v-for-v-if.js)
