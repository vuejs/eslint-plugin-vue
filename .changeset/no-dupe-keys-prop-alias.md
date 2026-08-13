---
"eslint-plugin-vue": patch
---

Fixed `vue/no-dupe-keys` not reporting `<script setup>` variables that shadow a prop while aliasing a different one, such as `const foo = toRef(props, 'bar')`
