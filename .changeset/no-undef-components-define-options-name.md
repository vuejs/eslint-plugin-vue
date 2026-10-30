---
"eslint-plugin-vue": patch
---

Fixed `vue/no-undef-components` reporting a `<script setup>` component that references itself by the name set with `defineOptions({ name })`
