---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-ref-as-operand
description: disallow use of value wrapped by `ref()` (Composition API) as an operand
since: v7.0.0
---

# vue/no-ref-as-operand

> disallow use of value wrapped by `ref()` (Composition API) as an operand

- :gear: This rule is included in the following preset configs:
  - `*.configs["flat/essential"]`
  - `*.configs["flat/vue2-essential"]`
  - `*.configs["flat/strongly-recommended"]`
  - `*.configs["flat/vue2-strongly-recommended"]`
  - `*.configs["flat/recommended"]`
  - `*.configs["flat/vue2-recommended"]`
  - `"plugin:vue/essential"`
  - `"plugin:vue/vue2-essential"`
  - `"plugin:vue/strongly-recommended"`
  - `"plugin:vue/vue2-strongly-recommended"`
  - `"plugin:vue/recommended"`
  - `"plugin:vue/vue2-recommended"`
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports cases where a ref is used incorrectly as an operand.\
You must use `.value` to access the `Ref` value.

<eslint-code-block fix :rules="{'vue/no-ref-as-operand': ['error']}">

```vue
<script>
import { ref } from 'vue'

export default {
  setup(_props, { emit }) {
    const count = ref(0)
    const ok = ref(true)

    /* ✓ GOOD */
    count.value++
    count.value + 1
    1 + count.value
    var msg = ok.value ? 'yes' : 'no'
    emit('increment', count.value)

    /* ✗ BAD */
    count++
    count + 1
    1 + count
    var msg = ok ? 'yes' : 'no'
    emit('increment', count)

    return {
      count
    }
  }
}
</script>
```

</eslint-code-block>

If type information is available (e.g. [`parserOptions.projectService`](https://typescript-eslint.io/packages/parser#projectservice) of [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) is enabled), this rule also reports values whose type is a ref, such as refs returned from composables.

Refs destructured from `storeToRefs()` imported from Pinia are also recognized, without requiring type information.

With type information, the rule also checks ref-valued member expressions in scripts and static member paths rooted in `<script setup>` bindings in templates:

```vue
<script setup lang="ts">
import { useMutation } from './mutations'

const mutation = useMutation() // returns { isLoading: Ref<boolean> }
const { isLoading } = mutation
</script>

<template>
  <!-- ✓ GOOD: top-level refs are automatically unwrapped -->
  <button :disabled="isLoading" />
  <!-- ✓ GOOD: nested refs require explicit access -->
  <button :disabled="mutation.isLoading.value" />
  <!-- ✗ BAD: the ref object is always truthy -->
  <button :disabled="!!mutation.isLoading" />
</template>
```

Template checks respect the binding's type, including ref unwrapping by `reactive()`. Template-local variables such as `v-for` aliases and slot props, dynamic member paths and bindings without type information are not checked. Passing a nested ref directly as a prop or function argument remains allowed, as does displaying it through text interpolation.

Nullish fallback expressions that pass a ref through unchanged, such as `useRef(state.loading ?? fallbackRef)`, remain allowed. The rule still reports the ref when that expression is used as a condition or another value operand, such as `if (state.loading ?? fallbackRef)`.

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Reactivity - Reactivity Fundamentals / Creating Standalone Reactive Values as `refs`](https://v3.vuejs.org/guide/reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs)
- [Vue RFCs - 0013-composition-api](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-ref-as-operand.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-ref-as-operand.test.ts)
