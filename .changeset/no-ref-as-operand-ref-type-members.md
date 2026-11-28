---
'eslint-plugin-vue': patch
---

Fixed `vue/no-ref-as-operand` reporting a member access on a ref-typed variable when the property is declared by the ref type, such as `message.reset()` in `const message = refManualReset('default message')`
