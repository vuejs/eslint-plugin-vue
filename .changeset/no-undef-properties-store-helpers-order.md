---
'eslint-plugin-vue': patch
---

Fixed `vue/no-undef-properties` false positives for properties from Vuex/Pinia `map*` helpers that are used before the helper call (e.g. in `watch` or `created`)
