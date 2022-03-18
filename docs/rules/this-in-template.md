---
pageClass: rule-details
sidebarDepth: 0
title: vue/this-in-template
description: disallow usage of `this` in template
since: v3.13.0
---
# vue/this-in-template

> disallow usage of `this` in template

- :gear: This rule is included in `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims at preventing usage of `this` in Vue templates.

<eslint-code-block fix :rules="{'vue/this-in-template': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <a :href="url">
    {{ text }}
  </a>
  
  <!-- ✗ BAD -->
  <a :href="this.url">
    {{ this.text }}
  </a>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/this-in-template": ["error", "always" | "never"]
}
```

- `"always"` ... Always use `this` while accessing properties from Vue.
- `"never"` (default) ... Never use `this` keyword in expressions.

### `"always"`

<eslint-code-block fix :rules="{'vue/this-in-template': ['error', 'always']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <a :href="this.url">
    {{ this.text }}
  </a>
  
  <!-- ✗ BAD -->
  <a :href="url">
    {{ text }}
  </a>
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.13.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/this-in-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/this-in-template.js)
