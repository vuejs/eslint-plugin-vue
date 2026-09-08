---
'eslint-plugin-vue': patch
---

Fix `vue/no-undef-properties` false positives for properties returned via `...toRefs(reactive({ ... }))` from `setup()`
