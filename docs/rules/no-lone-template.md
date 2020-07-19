---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-lone-template
description: disallow unnecessary `<template>`
---
# vue/no-lone-template
> disallow unnecessary `<template>`

- :gear: This rule is included in `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule aims to eliminate unnecessary and potentially confusing `<template>`.  
In Vue.js 2.x, the `<template>` elements that have no specific directives have no effect.  
In Vue.js 3.x, the `<template>` elements that have no specific directives render the `<template>` elements as is, but in most cases this may not be what you intended.

<eslint-code-block :rules="{'vue/no-lone-template': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <template v-if="foo">...</template>
  <template v-else-if="bar">...</template>
  <template v-else>...</template>
  <template v-for="e in list">...</template>
  <template v-slot>...</template>

  <!-- ✗ BAD -->
  <template>...</template>
  <template/>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-lone-template": ["error", {
    "ignoreAccessible": false
  }]
}
```

- `ignoreAccessible` ... If `true`, ignore accessible `<template>` elements. default `false`.  
  Note: this option is useless if you are using Vue.js 2.x.

### `"ignoreAccessible": true`

<eslint-code-block :rules="{'vue/no-lone-template': ['error', { 'ignoreAccessible': true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <template ref="foo">...</template>
  <template id="bar">...</template>

  <!-- ✗ BAD -->
  <template class="baz">...</template>
</template>
```

</eslint-code-block>

## :mute: When Not To Use It

If you are using Vue.js 3.x and want to define the `<template>` element intentionally, you will have to turn this rule off or use `"ignoreAccessible"` option.

## :couple: Related Rules

- [vue/no-template-key]
- [no-lone-blocks]

[no-lone-blocks]: https://eslint.org/docs/rules/no-lone-blocks
[vue/no-template-key]: ./no-template-key.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-lone-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-lone-template.js)
