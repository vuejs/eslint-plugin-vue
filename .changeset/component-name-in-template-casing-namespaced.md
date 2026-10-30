---
'eslint-plugin-vue': patch
---

Fixed `vue/component-name-in-template-casing` to check and autofix only the part before the dot of namespaced components such as `<Form.Input>`
