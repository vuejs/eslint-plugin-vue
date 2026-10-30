---
'eslint-plugin-vue': patch
---

Fixed `vue/no-useless-mustaches` autofix changing the rendered text when the result would start a new mustache interpolation (`{{ '{{' }}`) or join the surrounding text into a different character reference (`{{ '&' }}copy;`)
