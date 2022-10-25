---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-textarea-mustache
description: disallow mustaches in `<textarea>`
since: v3.0.0
---
# vue/no-textarea-mustache

> disallow mustaches in `<textarea>`

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule reports mustaches in `<textarea>`.

<eslint-code-block :rules="{'vue/no-textarea-mustache': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <textarea v-model="message" />

  <!-- ✗ BAD -->
  <textarea>{{ message }}</textarea>
</template>
```

</eslint-code-block>

<!-- markdownlint-disable-next-line no-inline-html -->
<div v-pre>

::: warning Note
Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't work. Use `v-model` instead.
[https://vuejs.org/guide/essentials/forms.html#multiline-text](https://vuejs.org/guide/essentials/forms.html#multiline-text)
:::

</div>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Form Input Bindings / Multiline text](https://vuejs.org/guide/essentials/forms.html#multiline-text)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-textarea-mustache.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-textarea-mustache.js)
