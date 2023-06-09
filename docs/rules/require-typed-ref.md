---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-typed-ref
description: require `ref` and `shallowRef` functions to be strongly typed
---
# vue/require-typed-ref

> require `ref` and `shallowRef` functions to be strongly typed

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule disallows calling `ref()` or `shallowRef()` functions without generic type parameter or an argument when using TypeScript.

With TypeScript it is easy to prevent usage of `any` by using [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny). Unfortunately this rule is easily bypassed with Vue `ref()` function. Calling `ref()` function without a generic parameter or an initial value leads to ref having `Ref<any>` type.

<eslint-code-block :rules="{'vue/require-typed-ref': ['error']}">

```vue
<script setup lang="ts">
import { ref, shallowRef, type Ref } from 'vue'

/* ✗ BAD */
const count = ref() // Returns Ref<any> that is not type checked
count.value = '50' // Should be a type error, but it is not

const count = shallowRef()

/* ✓ GOOD */
const count = ref<number>()
const count = ref(0)
const count: Ref<number | undefined> = ref()
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-typed-ref.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-typed-ref.js)
