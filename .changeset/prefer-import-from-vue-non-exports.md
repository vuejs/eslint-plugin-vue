---
"eslint-plugin-vue": patch
---

Fixed `vue/prefer-import-from-vue` to not report imports/exports of names from `@vue/reactivity` and `@vue/shared` that are not re-exported by `vue`.
