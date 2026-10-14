---
'eslint-plugin-vue': patch
---

Fixed `vue/component-name-in-template-casing` reporting namespaced components such as `<Form.Input>`, whose autofix could never change the name and caused circular fixes
