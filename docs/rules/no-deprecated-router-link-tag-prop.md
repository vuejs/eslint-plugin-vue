---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-router-link-tag-prop
description: disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)
since: v7.20.0
---
# vue/no-deprecated-router-link-tag-prop

> disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports deprecated the `tag` attribute on `RouterLink` elements (removed in Vue.js v3.0.0+).

<eslint-code-block :rules="{'vue/no-deprecated-router-link-tag-prop': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <RouterLink to="/">Home</RouterLink>
  <router-link to="/">Home</router-link>

  <RouterLink to="/">
    <div>Home</div>
  </RouterLink>

  <router-link to="/">
    <div>Home</div>
  </router-link>

  <NuxtLink tag="div" to="/">Home</NuxtLink>
  <nuxt-link tag="div" to="/">Home</nuxt-link>

  <!-- ✗ BAD -->
  <RouterLink tag="div" to="/">Home</RouterLink>
  <router-link tag="div" to="/">Home</router-link>
  <RouterLink :tag="someVariable" to="/">Home</RouterLink>
  <router-link :tag="someVariable" to="/">Home</router-link>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-deprecated-router-link-tag-prop": ["error", {
    "components": ['RouterLink']
  }]
}
```

- `components` (`string[]`) ... Component names which will be checked with the `tag` attribute. default `['RouterLink']`.

Note: this rule will check both `kebab-case` and `PascalCase` versions of the
given component names.

### `{ "components": ['RouterLink', 'NuxtLink'] }`

<eslint-code-block :rules="{'vue/no-deprecated-router-link-tag-prop': ['error', {'components': ['RouterLink', 'NuxtLink']}]}">

```vue
<template>
  <!-- ✗ BAD -->
  <RouterLink tag="div" to="/">Home</RouterLink>
  <router-link tag="div" to="/">Home</router-link>

  <RouterLink :tag="someVariable" to="/">Home</RouterLink>
  <router-link :tag="someVariable" to="/">Home</router-link>

  <NuxtLink tag="div" to="/">Home</NuxtLink>
  <nuxt-link tag="div" to="/">Home</nuxt-link>

  <NuxtLink :tag="someVariable" to="/">Home</NuxtLink>
  <nuxt-link :tag="someVariable" to="/">Home</nuxt-link>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Vue RFCs - 0021-router-link-scoped-slot](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0021-router-link-scoped-slot.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.20.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-router-link-tag-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-router-link-tag-prop.js)
