---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-mayberef-unwrap
description: require `MaybeRef` values to be unwrapped with `unref()` before using in conditions
---

# vue/require-mayberef-unwrap

> require `MaybeRef` values to be unwrapped with `unref()` before using in conditions

- :gear: This rule is included in all of `"plugin:vue/essential"`, `*.configs["flat/essential"]`, `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/recommended"` and `*.configs["flat/recommended"]`.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

`MaybeRef<T>` and `MaybeRefOrGetter<T>` are TypeScript utility types provided by Vue.  
They allow a value to be either a plain value **or** a `Ref<T>`. When such a variable is used in a boolean context you must first unwrap it with `unref()` so that the actual inner value is evaluated.  
This rule reports (and can auto-fix) places where a `MaybeRef*` value is used directly in a conditional expression, logical expression, unary operator, etc.

<eslint-code-block fix :rules="{'vue/require-mayberef-unwrap': ['error']}">

```vue
<script setup lang="ts">
import { ref, unref, type MaybeRef } from 'vue'

const maybeRef: MaybeRef<boolean> = ref(false)

/* ✓ GOOD */
if (unref(maybeRef)) {
  console.log('good')
}
const result = unref(maybeRef) ? 'true' : 'false'

/* ✗ BAD */
if (maybeRef) {
  console.log('bad')
}
const alt = maybeRef ? 'true' : 'false'
</script>
```

</eslint-code-block>

### What is considered **incorrect** ?

The following patterns are **incorrect**:

```ts
// Condition without unref
if (maybeRef) {}

// Ternary operator
const result = maybeRef ? 'a' : 'b'

// Logical expressions
const value = maybeRef || 'fallback'

// Unary operators
const negated = !maybeRef

// Type queries & wrappers
const t = typeof maybeRef
const b = Boolean(maybeRef)
```

### What is considered **correct** ?

```ts
if (unref(maybeRef)) {}
const result = unref(maybeRef) ? 'a' : 'b'
```

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide – Reactivity – `unref`](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#unref)
- [API – `MaybeRef`](https://vuejs.org/api/utility-types.html#mayberef)
- [API – `MaybeRefOrGetter`](https://vuejs.org/api/utility-types.html#maybereforgetter)

## :rocket: Version

This rule will be introduced in a future release of eslint-plugin-vue.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-mayberef-unwrap.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-mayberef-unwrap.js)
