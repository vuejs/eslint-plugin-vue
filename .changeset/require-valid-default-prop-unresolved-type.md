---
"eslint-plugin-vue": patch
---

Fixed `vue/require-valid-default-prop` false positive for props whose union type includes a type that cannot be resolved, such as an imported type
