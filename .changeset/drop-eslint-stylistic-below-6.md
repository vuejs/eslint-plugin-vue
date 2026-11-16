---
"eslint-plugin-vue": major
---

Dropped support for ESLint Stylistic < 6: the optional `@stylistic/eslint-plugin` peer dependency is now `^6.0.0`. Since ESLint Stylistic v6 changed the default option of `dot-location` to `"property"`, `vue/dot-location` now also defaults to `"property"` when ESLint Stylistic is installed
