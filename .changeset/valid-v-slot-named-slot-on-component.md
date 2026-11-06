---
'eslint-plugin-vue': minor
---

Changed [`vue/valid-v-slot`](https://eslint.vuejs.org/rules/valid-v-slot.html) to allow a named slot directly on a component (e.g. `<MyComponent #foo>…</MyComponent>`) when it is the only slot, which Vue 2.6+ and Vue 3 compile the same as `<MyComponent><template #foo>…</template></MyComponent>`
