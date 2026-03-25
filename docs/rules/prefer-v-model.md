---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-v-model
description: enforce using `v-model` instead of `:prop`/`@update:prop` pair
---

# vue/prefer-v-model

> enforce using `v-model` instead of `:prop`/`@update:prop` pair

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

In Vue 3, `:foo="bar" @update:foo="bar = $event"` can be simplified to `v-model:foo="bar"`, and `:modelValue="foo" @update:modelValue="foo = $event"` can be simplified to `v-model="foo"`. This rule suggests those simplifications.

<eslint-code-block :rules="{'vue/prefer-v-model': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component v-model="foo" />
  <my-component v-model:foo="bar" />
  <my-component :foo="bar" @update:foo="baz = $event" />
  <my-component :foo="bar" @update:foo="updateFoo($event)" />
  <my-component :foo="bar" @update:foo="(val) => updateFoo(val)" />

  <!-- ✗ BAD -->
  <my-component :modelValue="foo" @update:modelValue="foo = $event" />
  <my-component :model-value="foo" @update:model-value="foo = $event" />
  <my-component :foo="bar" @update:foo="bar = $event" />
  <my-component v-bind:foo="bar" v-on:update:foo="bar = $event" />
  <my-component :foo="bar" @update:foo="(val) => bar = val" />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue.js - Component v-model](https://vuejs.org/guide/components/v-model.html)
- [Vue.js - v-model arguments](https://vuejs.org/guide/components/v-model.html#v-model-arguments)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-v-model.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-v-model.test.ts)
