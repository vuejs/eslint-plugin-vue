---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-for-delimiter-style
description: enforce `v-for` directive's delimiter style
---
# vue/v-for-delimiter-style
> enforce `v-for` directive's delimiter style

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces which delimiter (`in` or `of`) should be used in `v-for` directives.

<eslint-code-block fix :rules="{'vue/v-for-delimiter-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-for="x in xs" />

  <!-- ✗ BAD -->
  <div v-for="x of xs" />
</template>
```

</eslint-code-block>

## :wrench: Options
Default is set to `in`.

```json
{
  "vue/v-for-delimiter-style": ["error", "in" | "of"]
}
```

- `"in"` (default) ... requires using `in`.
- `"of"` ... requires using `of`.

### `"of"`

<eslint-code-block fix :rules="{'vue/v-for-delimiter-style': ['error', 'of']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-for="x of xs" />

  <!-- ✗ BAD -->
  <div v-for="x in xs" />
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Guide - List Rendering](https://v3.vuejs.org/guide/list.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-for-delimiter-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-for-delimiter-style.js)
