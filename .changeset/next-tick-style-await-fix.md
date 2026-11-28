---
"eslint-plugin-vue": minor
---

Changed `vue/next-tick-style` autofix to use `await nextTick()` inside `async` functions when it is safe, and to suggest `await` and/or `.then()` in `async` functions otherwise; optional calls and `function` callbacks of `this.$nextTick()` and `Vue.nextTick()` are no longer fixed
