---
pageClass: rule-details
sidebarDepth: 0
title: vue/template-ref-pattern
description: enforce a naming pattern for template refs
---

# vue/template-ref-pattern

> enforce a naming pattern for template refs

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule enforces that the names of template refs match a configured pattern, so that they follow the same naming convention across a project.

It checks static `ref` attributes and `:ref` bindings to a string literal. Refs bound to an expression such as `:ref="table"` or a function ref are not checked, since their name is not known statically.

<eslint-code-block :rules="{'vue/template-ref-pattern': ['error', '.+Ref$']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <table ref="tableRef"></table>
  <FooBar ref="fooBarRef" />

  <!-- ✗ BAD -->
  <table ref="table"></table>
  <FooBar ref="fooBar" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/template-ref-pattern": ["error", "<pattern>"]
}
```

- `"<pattern>"` (`string`) ... A regular expression that ref names must match, for example `".+Ref$"`. Use the `"/.../flags"` form to pass flags, for example `"/ref$/i"`. There is no default, so the rule reports nothing until a pattern is set.

### `"/^[a-z][a-zA-Z0-9]*Ref$/u"`

<eslint-code-block :rules="{'vue/template-ref-pattern': ['error', '/^[a-z][a-zA-Z0-9]*Ref$/u']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <input ref="inputRef" />
  <input :ref="'inputRef'" />

  <!-- ✗ BAD -->
  <input ref="input" />
  <input ref="input-ref" />
  <input ref="InputRef" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-unused-refs](./no-unused-refs.md)
- [vue/prefer-use-template-ref](./prefer-use-template-ref.md)

## :books: Further Reading

- [Guide - Template Refs](https://vuejs.org/guide/essentials/template-refs.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/template-ref-pattern.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/template-ref-pattern.test.ts)
