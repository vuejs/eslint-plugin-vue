---
"eslint-plugin-vue": minor
---

Changed `vue/no-boolean-default` and `vue/require-default-prop` to match Vue's [Boolean Casting](https://vuejs.org/guide/components/props.html#boolean-casting) behavior (treat multi-type props that include `Boolean` as boolean props, unless `String` appears before `Boolean`)
