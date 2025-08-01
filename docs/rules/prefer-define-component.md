---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-define-component
description: require components to be defined using `defineComponent`
---

# vue/prefer-define-component

> require components to be defined using `defineComponent`

## :book: Rule Details

This rule enforces the use of `defineComponent` when defining Vue components. Using `defineComponent` provides proper typing in Vue 3 and IDE support for object properties.

<eslint-code-block :rules="{'vue/prefer-define-component': ['error']}">

```vue
<script>
import { defineComponent } from 'vue'

/* ✓ GOOD */
export default defineComponent({
  name: 'ComponentA',
  props: {
    message: String
  }
})
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/prefer-define-component': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'ComponentA',
  props: {
    message: String
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/prefer-define-component': ['error']}">

```vue
<script>
/* ✗ BAD */
export default Vue.extend({
  name: 'ComponentA',
  props: {
    message: String
  }
})
</script>
```

</eslint-code-block>

This rule doesn't report components using `<script setup>` without a normal `<script>` tag, as those don't require `defineComponent`.

<eslint-code-block :rules="{'vue/prefer-define-component': ['error']}">

```vue
<script setup>
/* ✓ GOOD - script setup doesn't need defineComponent */
import { ref } from 'vue'
const count = ref(0)
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/require-default-export](./require-default-export.md)
- [vue/require-direct-export](./require-direct-export.md)

## :books: Further Reading

- [Vue.js Guide - TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-define-component.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-define-component.js)
