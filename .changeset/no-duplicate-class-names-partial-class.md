---
'eslint-plugin-vue': patch
---

Fixed `vue/no-duplicate-class-names` to check the joined string of string concatenations and template literals, so it reports duplicate class names split across parts and no longer reports or autofixes partial class names, and fixed its autofix breaking template literal parts next to `${}`
