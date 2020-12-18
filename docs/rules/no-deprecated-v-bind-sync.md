---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-v-bind-sync
description: disallow use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)
---
# vue/no-deprecated-v-bind-sync
> disallow use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)

<eslint-code-block fix :rules="{'vue/no-deprecated-v-bind-sync': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-bind:propName="foo"/>
  <MyComponent :propName="foo"/>


  <!-- ✗ BAD -->
  <MyComponent v-bind:propName.sync="foo"/>
  <MyComponent v-bind:[dynamiArg].sync="foo"/>
  <MyComponent v-bind.sync="foo"/>
  <MyComponent :propName.sync="foo"/>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-v-bind]

[vue/valid-v-bind]: ./valid-v-bind.md

## :books: Further Reading

- [Vue RFCs - 0005-replace-v-bind-sync-with-v-model-argument](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0005-replace-v-bind-sync-with-v-model-argument.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-v-bind-sync.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-v-bind-sync.js)
