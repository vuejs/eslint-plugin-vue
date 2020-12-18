---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-multiple-objects-in-class
description: disallow to pass multiple objects into array to class
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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multiple-objects-in-class.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multiple-objects-in-class.js)
