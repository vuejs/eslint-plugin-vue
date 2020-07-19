---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-custom-modifiers-on-v-model
description: disallow custom modifiers on v-model used on the component
---
# vue/no-custom-modifiers-on-v-model
> disallow custom modifiers on v-model used on the component

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether `v-model `used on the component do not have custom modifiers.

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-custom-modifiers-on-v-model.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-custom-modifiers-on-v-model.js)
