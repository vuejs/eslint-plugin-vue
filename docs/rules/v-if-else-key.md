---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-if-else-key
description: require key attribute for conditionally rendered repeated components
since: v9.19.0
---

# vue/v-if-else-key

> require key attribute for conditionally rendered repeated components

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule checks for components that are both repeated and conditionally rendered within the same scope. If such a component is found, the rule then checks for the presence of a 'key' directive. If the 'key' directive is missing, the rule issues a warning and offers a fix.

This rule is not required in Vue 3, as the key is automatically assigned to the elements.

<eslint-code-block fix :rules="{'vue/v-if-else-key': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component v-if="condition1" :key="one" />
  <my-component v-else-if="condition2" :key="two" />
  <my-component v-else :key="three" />

  <!-- ✗ BAD -->
  <my-component v-if="condition1" />
  <my-component v-else-if="condition2" />
  <my-component v-else />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/require-v-for-key]

[vue/require-v-for-key]: ./require-v-for-key.md

## :books: Further Reading

- [Guide (for v2) - v-if without key](https://v2.vuejs.org/v2/style-guide/#v-if-v-else-if-v-else-without-key-use-with-caution)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.19.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-if-else-key.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-if-else-key.js)
