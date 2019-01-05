---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-multi-spaces
description: disallow multiple spaces
---
# vue/no-multi-spaces
> disallow multiple spaces

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims at removing multiple spaces in tags, which are not used for indentation.

<eslint-code-block fix :rules="{'vue/no-multi-spaces': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
    class="foo"
    :style="bar" />
  <i
    :class="{
      'fa-angle-up' : isExpanded,
      'fa-angle-down' : !isExpanded,
    }"
  />

  <!-- ✗ BAD -->
  <div     class="foo"
    :style =  "bar"         />
  <i
    :class="{
      'fa-angle-up'   : isExpanded,
      'fa-angle-down' : !isExpanded,
    }"
  />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-multi-spaces": ["error", {
    "ignoreProperties": false
  }]
}
```

- `ignoreProperties` ... whether or not objects' properties should be ignored. default `false`

### `"ignoreProperties": true`

<eslint-code-block fix :rules="{'vue/no-multi-spaces': ['error', { 'ignoreProperties': true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <i
    :class="{
      'fa-angle-up'   : isExpanded,
      'fa-angle-down' : !isExpanded,
    }"
  />
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multi-spaces.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multi-spaces.js)
