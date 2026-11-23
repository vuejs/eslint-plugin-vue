---
"eslint-plugin-vue": major
---

Removed the Vue.js 2.x configs (`flat/vue2-essential`, `flat/vue2-strongly-recommended`, `flat/vue2-strongly-recommended-error`, `flat/vue2-recommended` and `flat/vue2-recommended-error`): Vue.js 2.x projects can keep using eslint-plugin-vue v10. `vue/no-custom-modifiers-on-v-model` and `vue/no-multiple-template-root`, which were only included in these configs, are now uncategorized: enable them in your config if you still want to use them
