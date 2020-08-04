---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-model
description: enforce valid `v-model` directives
---
# vue/valid-v-model
> enforce valid `v-model` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-model` directive is valid.

## :book: Rule Details

This rule reports `v-model` directives in the following cases:

- The directive used on HTMLElement has an argument. E.g. `<input v-model:aaa="foo">`
- The directive used on HTMLElement has modifiers which are not supported. E.g. `<input v-model.bbb="foo">`
- The directive does not have that attribute value. E.g. `<input v-model>`
- The directive does not have the attribute value which is valid as LHS. E.g. `<input v-model="foo() + bar()">`, `<input v-model="a?.b">`
- The directive has potential null object property access. E.g. `<input v-model="(a?.b).c">`
- The directive is on unsupported elements. E.g. `<div v-model="foo"></div>`
- The directive is on `<input>` elements which their types are `file`. E.g. `<input type="file" v-model="foo">`
- The directive's reference is iteration variables. E.g. `<div v-for="x in list"><input type="file" v-model="x"></div>`

<eslint-code-block :rules="{'vue/valid-v-model': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input v-model="foo">
  <input v-model.lazy="foo">
  <textarea v-model="foo"/>
  <MyComponent v-model="foo"/>
  <MyComponent v-model:propName="foo"/>
  <MyComponent v-model.modifier="foo"/>
  <MyComponent v-model:propName.modifier="foo"/>
  <div v-for="todo in todos">
    <input v-model="todo.name">
  </div>

  <!-- ✗ BAD -->
  <input v-model>
  <input v-model:aaa="foo">
  <input v-model.bbb="foo">
  <input v-model="foo + bar">
  <input v-model="a?.b.c">
  <input v-model="(a?.b).c">
  <div v-model="foo"/>
  <div v-for="todo in todos">
    <input v-model="todo">
  </div>
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because it's checked by [vue/no-parsing-error] rule.
:::

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-parsing-error]

[vue/no-parsing-error]: ./no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-model.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-model.js)
