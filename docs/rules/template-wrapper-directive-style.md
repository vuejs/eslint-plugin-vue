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

Some templates cannot avoid a `<template>` wrapper, for example when several elements share one
`v-if` without an extra wrapper element. Disable the rule for those lines or add a wrapper element.

## :couple: Related Rules

- [vue/no-lone-template](./no-lone-template.md)
- [vue/no-use-v-if-with-v-for](./no-use-v-if-with-v-for.md)
