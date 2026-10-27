---
"eslint-plugin-vue": patch
---

Changed `vue/html-self-closing` autofix to always add a space before `/>`, which also stops it from breaking elements whose last attribute has an unquoted value
