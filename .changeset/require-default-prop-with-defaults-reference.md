---
"eslint-plugin-vue": patch
---

Fixed `vue/require-default-prop` false positives when the defaults are passed to `withDefaults()` by reference or spread instead of an inline object literal
