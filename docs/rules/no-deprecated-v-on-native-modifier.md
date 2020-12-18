---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-v-on-native-modifier
description: disallow using deprecated `.native` modifiers (in Vue.js 3.0.0+)
---
# vue/no-deprecated-v-on-native-modifier
> disallow using deprecated `.native` modifiers (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports use of deprecated `.native` modifier on `v-on` directive (in Vue.js 3.0.0+)

<eslint-code-block :rules="{'vue/no-deprecated-v-on-native-modifier': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <CoolInput v-on:keydown.enter="onKeydownEnter" />
  <CoolInput @keydown.enter="onKeydownEnter" />

  <!-- ✗ BAD -->
  <CoolInput v-on:keydown.native="onKeydown" />
  <CoolInput @keydown.enter.native="onKeydownEnter" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-on]

[vue/valid-v-on]: ./valid-v-on.md

## :books: Further Reading

- [Vue RFCs - 0031-attr-fallthrough](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-v-on-native-modifier.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-v-on-native-modifier.js)
