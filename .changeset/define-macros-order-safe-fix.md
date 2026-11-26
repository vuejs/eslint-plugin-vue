---
"eslint-plugin-vue": patch
---

Fixed `vue/define-macros-order` autofix moving a macro above a declaration that it references at runtime, or above a statement that uses the same variable; such cases are now reported without a fix. The autofix also no longer breaks code without semicolons when a statement starts with `(`, `[` or a template literal
