---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-ref-object-reactivity-loss
description: disallow usages of ref objects that can lead to loss of reactivity
since: v9.17.0
---

# vue/no-ref-object-reactivity-loss

> disallow usages of ref objects that can lead to loss of reactivity

## :book: Rule Details

This rule reports the usages of ref objects causing the value to lose reactivity.

<eslint-code-block :rules="{'vue/no-ref-object-reactivity-loss': ['error']}" language="javascript" filename="example.js" >

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

This rule used to also support [Reactivity Transform](https://vuejs.org/guide/extras/reactivity-transform.html) (`$ref()`, `$computed()`, `$$()`, etc.), but that proposal was dropped from Vue, so support for it was removed.

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.17.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-ref-object-reactivity-loss.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-ref-object-reactivity-loss.test.ts)
