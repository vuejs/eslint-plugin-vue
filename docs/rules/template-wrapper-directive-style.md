---
pageClass: rule-details
sidebarDepth: 0
title: vue/template-wrapper-directive-style
description: enforce or disallow `v-if`, `v-else-if`, `v-else` and `v-for` on `<template>` wrappers
---

# vue/template-wrapper-directive-style

> enforce or disallow `v-if`, `v-else-if`, `v-else` and `v-for` on `<template>` wrappers

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule enforces a consistent place for the `v-if`, `v-else-if`, `v-else` and `v-for` directives:
either always on a `<template>` wrapper, or never on one.

The root `<template>` of a single-file component and slot templates (`v-slot` / `#name`, `slot-scope`,
`slot`) are always ignored, because they are required by Vue.

Children of `<Transition>`, `<KeepAlive>` and `<TransitionGroup>` are checked like any other element.
A `<template>` wrapper around a single element or component compiles to the same code as the directive
on the element itself, so these components keep working with `"always"`. A wrapper with more than one
child is not allowed inside `<Transition>`; Vue reports that error on its own.

<eslint-code-block :rules="{'vue/template-wrapper-directive-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <template v-if="loading">
    <Spinner />
  </template>
  <template v-else>
    <Content />
  </template>
  <template v-for="item in items" :key="item.id">
    <MyItem :item="item" />
  </template>

  <!-- ✗ BAD -->
  <Spinner v-if="loading" />
  <Content v-else />
  <MyItem v-for="item in items" :key="item.id" :item="item" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/template-wrapper-directive-style": ["error", { "style": "always" }]
}
```

- `style` ... `"always"` (default) or `"never"`.
  - `"always"` ... requires the directives to be on a `<template>` wrapper.
  - `"never"` ... disallows the directives on a `<template>` wrapper.

### `{ "style": "never" }`

<eslint-code-block :rules="{'vue/template-wrapper-directive-style': ['error', { style: 'never' }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <Spinner v-if="loading" />
  <Content v-else />
  <MyItem v-for="item in items" :key="item.id" :item="item" />

  <!-- ✓ GOOD: the wrapper cannot be removed -->
  <template v-if="loading">
    <Spinner />
    <p>Loading…</p>
  </template>
  <template v-if="user">Hello {{ user.name }}</template>

  <!-- ✗ BAD -->
  <template v-if="loading">
    <Spinner />
  </template>
  <template v-for="item in items" :key="item.id">
    <MyItem :item="item" />
  </template>
</template>
```

</eslint-code-block>

With `"never"`, a `<template>` wrapper is only reported when it contains exactly one element and nothing
else, because only then can the directives be moved to that element. Wrappers with several elements,
text or interpolations are not reported.

## :couple: Related Rules

- [vue/no-lone-template](./no-lone-template.md)
- [vue/no-use-v-if-with-v-for](./no-use-v-if-with-v-for.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/template-wrapper-directive-style.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/template-wrapper-directive-style.test.ts)
