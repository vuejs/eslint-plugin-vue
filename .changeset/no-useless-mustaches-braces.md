---
'eslint-plugin-vue': patch
---

Fixed `vue/no-useless-mustaches` autofix turning `{{ '{{' }}` into the start of a new mustache interpolation
