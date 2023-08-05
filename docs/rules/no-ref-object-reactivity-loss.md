---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-ref-object-reactivity-loss
description: disallow usages of ref objects that can lead to loss of reactivity
---
# vue/no-ref-object-reactivity-loss

> disallow usages of ref objects that can lead to loss of reactivity

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

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

This rule also supports Reactivity Transform, but Reactivity Transform is an experimental feature and may have false positives due to future Vue changes.  
See the [RFC](https://github.com/vuejs/rfcs/pull/420) for more information on Reactivity Transform.

<eslint-code-block :rules="{'vue/no-ref-object-reactivity-loss': ['error']}" language="javascript" filename="example.js" >

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-ref-object-reactivity-loss.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-ref-object-reactivity-loss.js)
