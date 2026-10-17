---
"eslint-plugin-vue": patch
---

Fixed `vue/no-ref-as-operand` false negatives for refs on the right side of a logical expression whose result is used as an operand, e.g. `if (a && ref)`
