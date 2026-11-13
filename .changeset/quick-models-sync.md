---
"eslint-plugin-vue": minor
---

Extend [`vue/no-mutating-props`](https://eslint.vuejs.org/rules/no-mutating-props.html) to report nested mutation of a `defineModel()` ref (e.g. `model.value.foo = 1`, `model.value.items.push(1)`), which bypasses the `update:modelValue` emit.
