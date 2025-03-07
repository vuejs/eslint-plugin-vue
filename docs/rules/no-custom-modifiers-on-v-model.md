---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-custom-modifiers-on-v-model
description: disallow custom modifiers on v-model used on the component
since: v7.0.0
---

# vue/no-custom-modifiers-on-v-model

> disallow custom modifiers on v-model used on the component

- :gear: This rule is included in all of `"plugin:vue/vue2-essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/vue2-strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/vue2-recommended"` and `*.configs["flat/vue2-recommended"]`.

This rule checks whether `v-model` used on the component do not have custom modifiers.

## :book: Rule Details

This rule reports `v-model` directives in the following cases:

- The directive used on the component has custom modifiers. E.g. `<MyComponent v-model.aaa="foo" />`

<eslint-code-block :rules="{'vue/no-custom-modifiers-on-v-model': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-model="foo" />
  <MyComponent v-model.trim="foo" />
  <MyComponent v-model.lazy="foo" />
  <MyComponent v-model.number="foo" />

  <!-- ✗ BAD -->
  <MyComponent v-model.aaa="foo" />
  <MyComponent v-model.aaa.bbb="foo" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-model]

[vue/valid-v-model]: ./valid-v-model.md

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-custom-modifiers-on-v-model.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-custom-modifiers-on-v-model.js)
