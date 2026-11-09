---
'eslint-plugin-vue': minor
---

Changed `vue/no-side-effects-in-computed-properties` rule to also report function calls whose result is not used, such as `this.$emit()` or `console.log()`
