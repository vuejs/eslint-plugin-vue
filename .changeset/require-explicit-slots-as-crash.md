---
'eslint-plugin-vue': patch
---

Fixed `vue/require-explicit-slots` crashing when the `slots` option uses a type assertion other than `SlotsType<...>`, such as `slots: {} as any`
