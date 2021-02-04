---
pageClass: rule-details
sidebarDepth: 0
title: vue/single-attribute-single-line
description: enforce component opening tags with a single attribute to be on a single line
since: v7.5.0
---
# vue/single-attribute-single-line

> enforce component opening tags with a single attribute to be on a single line

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Ensures that component opening tags that only have one attribute are inline to improve readability.

## :book: Rule Details

This rule aims to enforce component opening tags with a single attribute to be place on a single line.
It checks all the elements in a template and verifies that when the number of attributes for a component is 1, that it is inlined on the opening tag.

<eslint-code-block fix :rules="{'vue/single-attribute-single-line': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent lorem="1"/>
  <MyComponent lorem="1" />
  <MyComponent lorem="1"></MyComponent>
  <MyComponent lorem="1">
    <p>content</p>
  </MyComponent>

  <!-- ✗ BAD -->
  <MyComponent
    lorem="1"
  />
  <MyComponent
    lorem="1"
  ></MyComponent>
  <MyComponent
    lorem="1"
  >
    <p>content</p>
  </MyComponent>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/single-attribute-single-line": ["error"]
}
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/single-attribute-single-line.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/single-attribute-single-line.js)
