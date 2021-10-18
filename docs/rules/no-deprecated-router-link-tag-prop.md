---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-router-link-tag-prop
description: disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)
---
# vue/no-deprecated-router-link-tag-prop

> disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule reports deprecated the `tag` attribute on `RouterLink` elements (removed in Vue.js v3.0.0+).

<eslint-code-block :rules="{'vue/no-deprecated-router-link-tag-prop': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <RouterLink to="/">Home</RouterLink>

  <RouterLink to="/">
    <div>Home</div>
  </RouterLink>

  <NuxtLink tag="div" to="/">Home</NuxtLink>

  <!-- ✗ BAD -->
  <RouterLink tag="div" to="/">Home</RouterLink>
  <RouterLink :tag="someVariable" to="/">Home</RouterLink>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-deprecated-router-link-tag-prop": ["error", {
    "components": ['RouterLink', 'NuxtLink']
  }]
}
```

### `{ "components": ['RouterLink', 'NuxtLink'] }`

<eslint-code-block :rules="{'vue/no-deprecated-router-link-tag-prop': ['error', {'components': ['RouterLink', 'NuxtLink']}]}">

```vue
<template>
  <!-- ✗ BAD -->
  <NuxtLink tag="div" to="/">Home</NuxtLink>
  <NuxtLink :tag="someVariable" to="/">Home</NuxtLink>

  <RouterLink tag="div" to="/">Home</RouterLink>
  <RouterLink :tag="someVariable" to="/">Home</RouterLink>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Vue RFCs - 0021-router-link-scoped-slot](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0021-router-link-scoped-slot.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-router-link-tag-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-router-link-tag-prop.js)
