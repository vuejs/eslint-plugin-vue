---
"eslint-plugin-vue": patch
---

Fixed `vue/padding-lines-in-component-definition` to check every pair of adjacent properties, not only the first, when `withinOption` or `withinEach` is not set
