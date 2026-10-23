---
'eslint-plugin-vue': patch
---

Fixed `vue/no-mutating-props` and `vue/no-side-effects-in-computed-properties` missing mutations through TypeScript type assertions, `satisfies` and non-null assertions, such as `(props.list as string[]).push(item)`
