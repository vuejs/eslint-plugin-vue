---
'eslint-plugin-vue': patch
---

Updated `nth-check` dependency to v3, which parses `:nth-*()` selectors in the `order` option of `vue/block-order`. Selector matching is unchanged, as v3 only switches the package to ESM, see [nth-check release notes](https://github.com/fb55/nth-check/releases/tag/v3.0.0)
