---
'eslint-plugin-vue': patch
---

Fixed `vue/prefer-separate-static-class` to ignore `:class` bindings with the `.attr` or `.prop` modifier, which its auto-fix turned into a regular `class` attribute
