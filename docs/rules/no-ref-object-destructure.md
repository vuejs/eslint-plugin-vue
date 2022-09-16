---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-ref-object-destructure
description: disallow destructuring of ref objects that can lead to loss of reactivity
since: v9.5.0
---
# vue/no-ref-object-destructure

> disallow destructuring of ref objects that can lead to loss of reactivity

## :book: Rule Details

This rule reports the destructuring of ref objects causing the value to lose reactivity.

<eslint-code-block :rules="{'vue/no-ref-object-destructure': ['error']}" language="javascript" filename="example.js" >

```js
import { ref } from 'vue'
const count = ref(0)
const v1 = count.value /* ✗ BAD */
const { value: v2 } = count /* ✗ BAD */
const v3 = computed(() => count.value /* ✓ GOOD */)
const v4 = fn(count.value) /* ✗ BAD */
const v5 = fn(count) /* ✓ GOOD */
const v6 = computed(() => fn(count.value) /* ✓ GOOD */)
```

</eslint-code-block>

This rule also supports Reactivity Transform, but Reactivity Transform is an experimental feature and may have false positives due to future Vue changes.  
See the [RFC](https://github.com/vuejs/rfcs/pull/420) for more information on Reactivity Transform.

<eslint-code-block :rules="{'vue/no-ref-object-destructure': ['error']}" language="javascript" filename="example.js" >

```js
const count = $ref(0)
const v1 = count /* ✗ BAD */
const v2 = $computed(() => count /* ✓ GOOD */)
const v3 = fn(count) /* ✗ BAD */
const v4 = fn($$(count)) /* ✓ GOOD */
const v5 = $computed(() => fn(count) /* ✓ GOOD */)
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-ref-object-destructure.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-ref-object-destructure.js)
