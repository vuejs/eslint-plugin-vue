---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-model-argument
description: disallow adding an argument to `v-model` used in custom component
---
# vue/no-v-model-argument
> disallow adding an argument to `v-model` used in custom component

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether `v-model` used on custom component do not have an argument.

## :book: Rule Details

This rule reports `v-model` directives in the following cases:

- The directive used on component has an argument. E.g. `<MyComponent v-model:aaa="foo" />`

<eslint-code-block :rules="{'vue/no-v-model-argument': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-model="foo" />


  <!-- ✗ BAD -->
  <MyComponent v-model:aaa="foo" />
</template>
```

</eslint-code-block>


## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-model]

[vue/valid-v-model]: ./valid-v-model.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-model-argument.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-model-argument.js)
