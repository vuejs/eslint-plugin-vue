---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-multiple-template-root
description: disallow adding multiple root nodes to the template
since: v7.0.0
---

# vue/no-multiple-template-root

> disallow adding multiple root nodes to the template

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/vue2-recommended"]`.

## :book: Rule Details

This rule checks whether template contains single root element valid for Vue 2.

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- The root is text -->
<template>Lorem ipsum</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- There are multiple root elements -->
<template>
  <div>hello</div>
  <div>hello</div>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- The root element has `v-for` directives -->
<template>
  <div v-for="item in items" />
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- The root element is `<template>` or `<slot>` -->
<template>
  <slot />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multiple-template-root.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multiple-template-root.js)
