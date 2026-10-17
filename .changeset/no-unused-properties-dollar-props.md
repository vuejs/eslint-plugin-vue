---
"eslint-plugin-vue": patch
---

Fixed `vue/no-unused-properties` not reporting unused non-props properties in components that use `$props` as a whole (e.g. `v-bind="$props"`)
