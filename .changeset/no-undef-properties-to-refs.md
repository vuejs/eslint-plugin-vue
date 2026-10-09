---
'eslint-plugin-vue': patch
---

Fixed `vue/no-undef-properties` false positives for properties returned via `...toRefs(reactive({ ... }))` from `setup()`
