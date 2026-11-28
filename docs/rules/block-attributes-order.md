---
pageClass: rule-details
sidebarDepth: 0
title: vue/block-attributes-order
description: enforce order of attributes on top-level blocks
---

# vue/block-attributes-order

> enforce order of attributes on top-level blocks

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a consistent order of the attributes on the top-level blocks of a single-file component, such as `<script>`, `<template>`, `<style>` and custom blocks. For example, it can make sure that all components use `<script setup lang="ts">` rather than a mix of that and `<script lang="ts" setup>`.

By default, `lang` and `src` go after all other attributes, except that `generic` goes between them on `<script>`, as in the [Vue documentation](https://vuejs.org/api/sfc-script-setup.html#generics). `setup` goes first on `<script>`, `functional` goes first on `<template>`, and `scoped` and `module` go first on `<style>`.

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error']}">

```vue
<!-- ✓ GOOD -->
<script setup lang="ts" generic="T"></script>
<template lang="pug"></template>
<style scoped lang="scss"></style>
<i18n locale="en" lang="yaml"></i18n>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error']}">

```vue
<!-- ✗ BAD -->
<script lang="ts" setup generic="T"></script>
<style lang="scss" scoped></style>
<i18n lang="yaml" locale="en"></i18n>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/block-attributes-order": ["error", [
    {
      "element": "script",
      "order": ["setup", ["!lang", "!generic", "!src"], "lang", "generic", "src"]
    },
    {
      "element": "template",
      "order": ["functional", ["!lang", "!src"], "lang", "src"]
    },
    {
      "element": "style",
      "order": ["scoped", "module", ["!lang", "!src"], "lang", "src"]
    },
    {
      "element": "*",
      "order": [["!lang", "!src"], "lang", "src"]
    }
  ]]
}
```

The option is an array of objects that describe the attribute order for some blocks. When set, it replaces the default shown above. Each object has the following properties:

- `element` (`string`) ... The blocks the order applies to. This is a CSS selector, such as `script`, `script[setup]`, `i18n:not([locale=en])` or `*`. Each block uses the first object whose `element` matches it. Blocks that match no object are not checked.
- `order` (`(string | string[])[]`) ... The order of the attributes. Each item matches attribute names with a pattern or an array of patterns:
  - `"foo"` ... Matches the `foo` attribute.
  - `"/foo/"` ... Matches attribute names that match the `/foo/` regular expression.
  - `"!foo"` ... Excludes the `foo` attribute from the names matched by the preceding patterns of the array. When it comes first in the array or is used alone, it matches all names except `foo`.
  - `"!/foo/"` ... Same as `"!foo"`, but excludes the names that match the `/foo/` regular expression.
  - `["foo", "/^bar/u"]` ... Matches the `foo` attribute and the attribute names that match `/^bar/u`.
  - `["/^foo/u", "!foo-bar", "/^baz/u"]` ... Matches the attribute names that match `/^foo/u` except `foo-bar`, and the attribute names that match `/^baz/u`.

  An attribute uses the first item that matches it. Attributes that match the same item may appear in any order among themselves, and attributes that match no item must go after all others.

### Custom order

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error', [{ element: 'script', order: ['lang', 'setup'] }, { element: 'style', order: ['lang', ['scoped', 'module']] }]]}">

```vue
<!-- ✓ GOOD -->
<script lang="ts" setup></script>
<style lang="scss" scoped></style>
<style lang="scss" module></style>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error', [{ element: 'script', order: ['lang', 'setup'] }, { element: 'style', order: ['lang', ['scoped', 'module']] }]]}">

```vue
<!-- ✗ BAD -->
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
<style module="classes" lang="scss"></style>
```

</eslint-code-block>

### Custom blocks

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error', [{ element: 'i18n', order: ['global', 'locale', ['!lang', '!src'], 'lang', 'src'] }]]}">

```vue
<!-- ✓ GOOD -->
<i18n global lang="json"></i18n>
<i18n locale="en" lang="yaml" src="./en.yaml"></i18n>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-attributes-order': ['error', [{ element: 'i18n', order: ['global', 'locale', ['!lang', '!src'], 'lang', 'src'] }]]}">

```vue
<!-- ✗ BAD -->
<i18n lang="json" global></i18n>
<i18n src="./en.yaml" locale="en" lang="yaml"></i18n>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/attributes-order](./attributes-order.md)
- [vue/block-order](./block-order.md)
- [vue/block-lang](./block-lang.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/block-attributes-order.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/block-attributes-order.test.ts)
