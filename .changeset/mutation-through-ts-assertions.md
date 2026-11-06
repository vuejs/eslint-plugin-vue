---
'eslint-plugin-vue': patch
---

Fixed `vue/no-mutating-props` missing mutations through TypeScript type assertions, `satisfies` and non-null assertions, such as `(props.list as string[]).push(item)`, and `vue/no-side-effects-in-computed-properties` missing them on member chains, such as `(this.list as string[]).push(item)` in a computed property
