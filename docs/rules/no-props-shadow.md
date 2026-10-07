---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-props-shadow
description: disallow declarations that shadow props in `<script setup>`
---

# vue/no-props-shadow

> disallow declarations that shadow props in `<script setup>`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports top-level declarations in `<script setup>` that have the same name as a prop.

In `<script setup>` the props and the top-level bindings of the script are both exposed to the template. When a local binding has the same name as a prop, it is ambiguous which of the two the template renders, and the answer (the local binding wins) is rarely what the author expected.

<eslint-code-block :rules="{'vue/no-props-shadow': ['error']}">

```vue
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  isDisabled: Boolean,
  title: String,
  count: Number
})

/* ✓ GOOD */
const disabledLabel = computed(() => (props.isDisabled ? 'yes' : 'no'))

/* ✗ BAD */
const isDisabled = computed(() => (props.isDisabled ? 'yes' : 'no'))
const title = ref('')
const count = 0
</script>

<template>
  <!-- Renders the local `isDisabled`, not the prop. -->
  <h1>Disabled: {{ isDisabled }}</h1>
</template>
```

</eslint-code-block>

The rule reports every kind of top-level binding, because they all reach the template: `const`, `let`, `var`, function declarations, class declarations and imports.

The following are **not** reported:

- The binding that holds the result of `defineProps()`, including the destructured form. Those bindings _are_ the props, so they cannot shadow them.

  <eslint-code-block :rules="{'vue/no-props-shadow': ['error']}">

  ```vue
  <script setup>
  /* ✓ GOOD */
  const props = defineProps({ foo: String })
  </script>
  ```

  </eslint-code-block>

  <eslint-code-block :rules="{'vue/no-props-shadow': ['error']}">

  ```vue
  <script setup>
  /* ✓ GOOD */
  const { foo } = defineProps({ foo: String })
  </script>
  ```

  </eslint-code-block>

- Declarations in nested scopes. A variable inside a function body or a block is not exposed to the template, so it cannot make the template ambiguous.

  <eslint-code-block :rules="{'vue/no-props-shadow': ['error']}">

  ```vue
  <script setup>
  defineProps({ foo: String })

  /* ✓ GOOD */
  function log(foo) {
    const bar = foo
    console.log(bar)
  }
  </script>
  ```

  </eslint-code-block>

- Type-only declarations, such as `interface`, `type` and type-only imports. They exist only at compile time.

- Code outside `<script setup>`. In the Options API the template resolves names through the component instance, where a local variable of `setup()` or of the module scope is not visible, so the same ambiguity cannot arise. Duplicated names in the Options API are reported by [vue/no-dupe-keys](./no-dupe-keys.md) instead.

- Props created by `defineModel()`. Such a prop is meant to be consumed through the ref that the macro returns, and naming that ref after the model (`const foo = defineModel('foo')`) is the idiomatic usage rather than a mistake.

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-dupe-keys](./no-dupe-keys.md)
- [vue/no-reserved-props](./no-reserved-props.md)
- [vue/no-template-shadow](./no-template-shadow.md)

## :books: Further Reading

- [Guide - SFC `<script setup>`](https://vuejs.org/api/sfc-script-setup.html)
- [Guide - Props / Reactive Props Destructure](https://vuejs.org/guide/components/props.html#reactive-props-destructure)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-props-shadow.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-props-shadow.test.ts)
