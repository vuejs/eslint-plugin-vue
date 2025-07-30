---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-v-text-v-html-on-component
description: disallow v-text / v-html on component
since: v8.4.0
---

# vue/no-v-text-v-html-on-component

> disallow v-text / v-html on component

- :gear: This rule is included in all of `"plugin:vue/vue2-essential"`, `*.configs["flat/vue2-essential"]`, `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/vue2-strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue2-recommended"`, `*.configs["flat/vue2-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/recommended"]`.

## :book: Rule Details

This rule disallows the use of v-text / v-html on component.

If you use v-text / v-html on a component, it will overwrite the component's content and may break the component.

<eslint-code-block :rules="{'vue/no-v-text-v-html-on-component': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-text="content"></div>
  <div v-html="html"></div>
  <svg><g v-text="content" /></svg>
  <math><mi v-text="content" /></math>
  <MyComponent>{{ content }}</MyComponent>

  <!-- ✗ BAD -->
  <MyComponent v-text="content"></MyComponent>
  <MyComponent v-html="html"></MyComponent>
  <g v-text="content" />
  <mi v-text="content" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-v-text-v-html-on-component": ["error", {
    "allow": ["router-link", "nuxt-link"],
    "ignoreElementNamespaces": false
  }]
}
```

- `allow` (`string[]`) ... Specify a list of custom components for which the rule should not apply.
- `ignoreElementNamespaces` (`boolean`) ... If `true`, always treat SVG and MathML tag names as HTML elements, even if they are not used inside a SVG/MathML root element. Default is `false`.

### `{ "allow": ["router-link", "nuxt-link"] }`

<eslint-code-block :rules="{'vue/no-v-text-v-html-on-component': ['error', { allow: ['router-link', 'nuxt-link'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <router-link v-html="content" />
  <NuxtLink v-html="content" />

  <!-- ✗ BAD -->
  <MyComponent v-html="content" />
</template>
```

</eslint-code-block>

### `{ "ignoreElementNamespaces": true }`

<eslint-code-block :rules="{'vue/no-v-text-v-html-on-component': ['error', { ignoreElementNamespaces: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <g v-text="content" /> <!-- SVG element not inside of <svg> -->
  <mi v-text="content" /> <!-- MathML element not inside of <math> -->
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-v-text](./no-v-text.md)
- [vue/no-v-html](./no-v-html.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-v-text-v-html-on-component.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-v-text-v-html-on-component.js)
