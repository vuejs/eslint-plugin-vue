---
pageClass: rule-details
sidebarDepth: 0
title: vue/script-setup-uses-vars
description: prevent `<script setup>` variables used in `<template>` to be marked as unused
since: v7.13.0
---
# vue/script-setup-uses-vars

> prevent `<script setup>` variables used in `<template>` to be marked as unused

- :gear: This rule is included in all of `"plugin:vue/base"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-essential"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/recommended"` and `"plugin:vue/vue3-recommended"`.

ESLint `no-unused-vars` rule does not detect variables in `<script setup>` used in `<template>`.
This rule will find variables in `<script setup>` used in `<template>` and mark them as used.

This rule only has an effect when the `no-unused-vars` rule is enabled.

## :book: Rule Details

Without this rule this code triggers warning:

<eslint-code-block :rules="{'vue/script-setup-uses-vars': ['error'], 'no-unused-vars': ['error']}">

```vue
<script setup>
  // imported components are also directly usable in template
  import Foo from './Foo.vue'
  import { ref } from 'vue'

  // write Composition API code just like in a normal setup()
  // but no need to manually return everything
  const count = ref(0)
  const inc = () => {
    count.value++
  }
</script>

<template>
  <Foo :count="count" @click="inc" />
</template>
```

</eslint-code-block>

After turning on, `Foo` is being marked as used and `no-unused-vars` rule doesn't report an issue.

## :mute: When Not To Use It

If you are not using `<script setup>` or if you do not use the `no-unused-vars` rule then you can disable this rule.

## :couple: Related Rules

- [vue/jsx-uses-vars](./jsx-uses-vars.md)
- [no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)

## :books: Further Reading

- [Vue RFCs - 0040-script-setup](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.13.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/script-setup-uses-vars.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/script-setup-uses-vars.js)
