---
"eslint-plugin-vue": patch
---

Fixed `vue/use-v-on-exact` to avoid reporting `@keydown.stop` when paired with an exact key-specific listener.
