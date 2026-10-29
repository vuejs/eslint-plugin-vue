---
"eslint-plugin-vue": minor
---

Changed `vue/next-tick-style` autofix to use `await nextTick()` inside `async` functions when it is safe, and to only suggest `await` or `.then()` elsewhere in `async` functions
