---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-textarea-mustache
description: disallow mustaches in `<textarea>`
---
# vue/no-textarea-mustache
> disallow mustaches in `<textarea>`

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

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

::: warning Note
Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't work. Use `v-model` instead.
[https://vuejs.org/v2/guide/forms.html#Multiline-text](https://vuejs.org/v2/guide/forms.html#Multiline-text)
:::

## :wrench: Options

Nothing.

## :books: Further reading

- [Guide - Forms / Multiline text](https://vuejs.org/v2/guide/forms.html#Multiline-text)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-textarea-mustache.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-textarea-mustache.js)
