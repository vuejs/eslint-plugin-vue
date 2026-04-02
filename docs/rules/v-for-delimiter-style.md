---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-for-delimiter-style
description: enforce `v-for` directive's delimiter style
since: v7.0.0
---

# vue/v-for-delimiter-style

> enforce `v-for` directive's delimiter style

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

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
  "vue/v-for-delimiter-style": ["error", "in" | "of" | { 
    "array": "in" | "of",
    "object": "in" | "of",
    "number": "in" | "of",
    "string": "in" | "of",
    "iterable": "in" | "of",
    "unknown": "in" | "of"
  }]
}
```

- `"in"` (default) ... requires using `in`.
- `"of"` ... requires using `of`.
- Object option ... configure which delimiter to require per loop type. Each property is optional; omitted types are not enforced. Some types cannot be determined without [`@typescript-eslint/parser`](https://typescript-eslint.io/packages/parser), then `"unknown"` will be used if specified.
  - `"array"` ... delimiter for arrays
  - `"object"` ... delimiter for objects
  - `"number"` ... delimiter for numbers
  - `"string"` ... delimiter for strings
  - `"iterable"` ... delimiter for custom iterables like `Set` or `Map`
  - `"unknown"` ... delimiter to enforce when the type of the iterable cannot be determined

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

### Object option

Configure which delimiter to use for each loop type independently. Properties that are omitted are not enforced. When the iterable type cannot be determined (e.g. when [`@typescript-eslint/parser`](https://typescript-eslint.io/packages/parser) with type information is not configured), the `unknown` property controls enforcement.

**Example:** mimicking native JavaScript semantics (`for…of` for sequences, `for…in` for objects):

```json
{
  "vue/v-for-delimiter-style": ["error", {
    "array": "of",
    "object": "in",
    "iterable": "of",
    "unknown": "of"
  }]
}
```

<eslint-code-block fix :rules="{'vue/v-for-delimiter-style': ['error', { array: 'of', object: 'in', number: 'of', string: 'of', iterable: 'of' }]}">

```vue
<template>
  <!-- ✓ GOOD (array → "of", object → "in") -->
  <div v-for="item of items" />
  <div v-for="(value, key, index) in obj" />

  <!-- ✗ BAD -->
  <div v-for="item in items" />
  <div v-for="(value, key, index) of obj" />
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Guide - List Rendering](https://vuejs.org/guide/essentials/list.html)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-for-delimiter-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-for-delimiter-style.test.ts)
