---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-bind
description: enforce valid `v-bind` directives
---
# vue/valid-v-bind
> enforce valid `v-bind` directives

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-bind` directive is valid.

## :book: Rule Details

This rule reports `v-bind` directives in the following cases:

- The directive does not have that attribute value. E.g. `<div v-bind:aaa></div>`
- The directive has invalid modifiers. E.g. `<div v-bind:aaa.bbb="ccc"></div>`

This rule does not report `v-bind` directives which do not have their argument (E.g. `<div v-bind="aaa"></div>`) because it's valid if the attribute value is an object.

<eslint-code-block :rules="{'vue/valid-v-bind': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-bind="foo"/>
  <div v-bind:aaa="foo"/>
  <div :aaa="foo"/>
  <div :aaa.prop="foo"/>

  <!-- ✗ BAD -->
  <div v-bind/>
  <div :aaa/>
  <div v-bind:aaa.bbb="foo"/>
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
- [vue/no-deprecated-v-bind-sync]
- [vue/valid-v-bind-sync]

[vue/no-parsing-error]: ./no-parsing-error.md
[vue/no-deprecated-v-bind-sync]: ./no-deprecated-v-bind-sync.md
[vue/valid-v-bind-sync]: ./valid-v-bind-sync.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-bind.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-bind.js)
