---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-define-component
description: require components to be defined using `defineComponent`
---

# vue/prefer-define-component

> require components to be defined using `defineComponent`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports components that are exported as a plain object or with `Vue.extend()` instead of being wrapped in `defineComponent()`. Wrapping them in a TypeScript `as` or `satisfies` expression does not change this.

`defineComponent()` enables type inference for the component options in TypeScript and improves autocompletion in editors for JavaScript components as well. Components that use `<script setup>` are not checked.

<eslint-code-block :rules="{'vue/prefer-define-component': ['error']}">

```vue
<script>
import { defineComponent } from 'vue'

/* ✓ GOOD */
export default defineComponent({
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
import Vue from 'vue'

/* ✗ BAD */
export default Vue.extend({
  props: {
    message: String
  }
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/require-default-export](./require-default-export.md)
- [vue/require-direct-export](./require-direct-export.md)
- [vue/prefer-define-options](./prefer-define-options.md)

## :books: Further Reading

- [Guide - TypeScript with Options API](https://vuejs.org/guide/typescript/options-api.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-define-component.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-define-component.test.ts)
