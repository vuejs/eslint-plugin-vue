---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-duplicate-attributes
description: disallow duplication of attributes
since: v3.0.0
---
# vue/no-duplicate-attributes

> disallow duplication of attributes

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

When duplicate arguments exist, only the last one is valid.
It's possibly mistakes.

## :book: Rule Details

This rule reports duplicate attributes.
`v-bind:foo` directives are handled as the attributes `foo`.

<eslint-code-block :rules="{'vue/no-duplicate-attributes': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent :foo="abc" />
  <MyComponent foo="abc" />
  <MyComponent class="abc" :class="def" />

  <!-- ✗ BAD -->
  <MyComponent :foo="abc" foo="def" />
  <MyComponent foo="abc" :foo="def" />
  <MyComponent foo="abc" foo="def" />
  <MyComponent :foo.a="abc" :foo.b="def" />
  <MyComponent class="abc" class="def" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-duplicate-attributes": ["error", {
    "allowCoexistClass": true,
    "allowCoexistStyle": true
  }]
}
```

- `allowCoexistClass` (`boolean`) ... Enables [`v-bind:class`] directive can coexist with the plain `class` attribute. Default is `true`.
- `allowCoexistStyle` (`boolean`) ... Enables [`v-bind:style`] directive can coexist with the plain `style` attribute. Default is `true`.

[`v-bind:class`]: https://v3.vuejs.org/guide/class-and-style.html
[`v-bind:style`]: https://v3.vuejs.org/guide/class-and-style.html

### `"allowCoexistClass": false, "allowCoexistStyle": false`

<eslint-code-block :rules="{'vue/no-duplicate-attributes': ['error', {allowCoexistClass: false, allowCoexistStyle: false}]}">

```vue
<template>
  <!-- ✗ BAD -->
  <MyComponent class="abc" :class="def" />
  <MyComponent style="abc" :style="def" />
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-duplicate-attributes.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-duplicate-attributes.js)
