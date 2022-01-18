---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-text-v-html-on-component
description: disallow v-text / v-html on component
---
# vue/no-v-text-v-html-on-component

> disallow v-text / v-html on component

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule disallows the use of v-text / v-html on component.

If you use v-text / v-html on a component, it will overwrite the component's content and may break the component.

<eslint-code-block :rules="{'vue/no-v-text-v-html-on-component': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-text="content"></div>
  <div v-html="html"></div>
  <MyComponent>{{content}}</MyComponent>

  <!-- ✗ BAD -->
  <MyComponent v-text="content"></MyComponent>
  <MyComponent v-html="html"></MyComponent>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-text-v-html-on-component.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-text-v-html-on-component.js)
