---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-for
description: enforce valid `v-for` directives
---
# vue/valid-v-for
> enforce valid `v-for` directives

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-for` directive is valid.

## :book: Rule Details

This rule reports `v-for` directives in the following cases:

- The directive has that argument. E.g. `<div v-for:aaa></div>`
- The directive has that modifier. E.g. `<div v-for.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-for></div>`
- If the element which has the directive is a custom component, the component does not have `v-bind:key` directive. E.g. `<your-component v-for="item in list"></your-component>`
- The `v-bind:key` directive does not use the variables which are defined by the `v-for` directive. E.g. `<div v-for="x in list" :key="foo"></div>`

If the element which has the directive is a reserved element, this rule does not report it even if the element does not have `v-bind:key` directive because it's not fatal error. [require-v-for-key] rule reports it.

<eslint-code-block :rules="{'vue/valid-v-for': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-for="todo in todos"/>
  <MyComponent
    v-for="todo in todos"
    :key="todo.id"
  />
  <div
    v-for="todo in todos"
    :is="MyComponent"
    :key="todo.id"
  />

  <!-- ✗ BAD -->
  <div v-for/>
  <div v-for:aaa="todo in todos"/>
  <div v-for.bbb="todo in todos"/>
  <div
    v-for="todo in todos"
    is="MyComponent"
  />
  <MyComponent v-for="todo in todos"/>
  <MyComponent
    v-for="todo in todos"
    :key="foo"
  />
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives. [no-parsing-error] rule reports it.
The following cases are syntax errors:

- The directive's value isn't `alias in expr`. E.g. `<div v-for="foo"></div>`
- The alias isn't LHS. E.g. `<div v-for="foo() in list"></div>`
:::

## :wrench: Options

Nothing.

## :couple: Related rules

- [require-v-for-key]
- [no-parsing-error]


[require-v-for-key]: require-v-for-key.md
[no-parsing-error]: no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-for.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-for.js)
