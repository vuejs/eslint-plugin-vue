---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-multiple-objects-in-class
description: disallow to pass multiple objects into array to class
since: v7.0.0
---
# vue/no-multiple-objects-in-class

> disallow to pass multiple objects into array to class

## :book: Rule Details

This rule disallows to pass multiple objects into array to class.  

<eslint-code-block :rules="{'vue/no-multiple-objects-in-class': ['error']}">

```vue
<template>
  <div>
    <!-- ✓ GOOD -->
    <div :class="[{'foo': isFoo, 'bar': isBar}]" />

    <!-- ✗ BAD -->
    <div :class="[{'foo': isFoo}, {'bar': isBar}]" />
  </div>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multiple-objects-in-class.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multiple-objects-in-class.js)
