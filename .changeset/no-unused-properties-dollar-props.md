---
"eslint-plugin-vue": patch
---

Fixed `vue/no-unused-properties` not reporting unused data, computed properties, methods, injections and `setup()` properties in components that use `$props` as a whole (e.g. `v-bind="$props"`)
