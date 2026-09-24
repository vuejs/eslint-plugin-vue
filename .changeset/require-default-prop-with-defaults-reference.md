---
"eslint-plugin-vue": patch
---

Fixed `vue/require-default-prop`, `vue/no-boolean-default`, `vue/no-required-prop-with-default` and `vue/require-valid-default-prop` not handling defaults that are passed to `withDefaults()` by reference or spread instead of an inline object literal
