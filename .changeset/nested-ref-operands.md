---
'eslint-plugin-vue': minor
---

Extended `vue/no-ref-as-operand` to check ref-valued member expressions using type information, including static member paths in `<script setup>` templates. Recognized Pinia's `storeToRefs()` in ref tracking.

Allowed nullish fallback expressions that pass refs through unchanged, while still reporting refs when the result is used as a condition or value operand.
