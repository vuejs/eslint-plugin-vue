---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-memo
description: enforce valid `v-memo` directives
since: v7.16.0
---
# vue/valid-v-memo

> enforce valid `v-memo` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

This rule checks whether every `v-memo` directive is valid.

## :book: Rule Details

This rule reports `v-memo` directives in the following cases:

- The directive has that argument. E.g. `<div v-memo:aaa></div>`
- The directive has that modifier. E.g. `<div v-memo.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-memo></div>`
- The attribute value of the directive is definitely not array. E.g. `<div v-memo="{x}"></div>`
- The directive was used inside v-for. E.g. `<div v-for="i in items"><div v-memo="[i]" /></div>`

<eslint-code-block :rules="{'vue/valid-v-memo': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-memo="[x]"/>

  <!-- ✗ BAD -->
  <div v-memo/>
  <div v-memo:aaa="[x]"/>
  <div v-memo.bbb="[x]"/>
  <div v-memo="{x}"/>
  <div v-for="i in items">
    <div v-memo="[i]" />
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

## :books: Further Reading

- [API - v-memo](https://v3.vuejs.org/api/directives.html#v-memo)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.16.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-memo.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-memo.js)
