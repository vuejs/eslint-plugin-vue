---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-html-elements
description: disallow using deprecated HTML elements
---

# vue/no-deprecated-html-elements

> disallow using deprecated HTML elements

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports HTML elements that the HTML Standard lists as [non-conforming features](https://html.spec.whatwg.org/multipage/obsolete.html#non-conforming-features), such as `<center>`, `<font>`, `<marquee>` and `<strike>`. The list ships with eslint-plugin-vue and is updated from the HTML Standard, so you don't have to maintain it yourself.

Besides being obsolete, all of these elements except `<param>` are unknown to Vue 3's template compiler, which resolves them as components first and warns about it in development.

Components with the same names, such as `<Center>` or `<Font>`, and elements that render a component through `is`, `:is` or `v-is` are not reported.

<eslint-code-block :rules="{'vue/no-deprecated-html-elements': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <s>old price</s>
  <span class="centered">text</span>
  <Center>component</Center>
  <font is="vue:my-font">component</font>

  <!-- ✗ BAD -->
  <strike>old price</strike>
  <center>text</center>
  <font color="red">text</font>
  <marquee>news</marquee>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-restricted-html-elements](./no-restricted-html-elements.md)

## :books: Further Reading

- [HTML Standard - Obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html#non-conforming-features)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-html-elements.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-html-elements.test.ts)
