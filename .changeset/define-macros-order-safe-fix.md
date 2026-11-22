---
"eslint-plugin-vue": patch
---

Fixed `vue/define-macros-order` autofix moving a macro above a declaration that it references at runtime; such cases are now reported without a fix
