---
"eslint-plugin-vue": patch
---

Fixed `eslint-plugin-vue/dist/utils/index.js` so that its utils (e.g. `defineTemplateBodyVisitor`) can be used without `.default` again, as with `eslint-plugin-vue/lib/utils/index.js` before v10.7.0
