---
"eslint-plugin-vue": patch
---

Fixed `vue/no-dupe-keys` not reporting `defineModel()` names that collide with a prop, another model, or a `<script setup>` variable
