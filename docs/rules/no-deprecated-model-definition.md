---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-model-definition
description: disallow deprecated `model` definition (in Vue.js 3.0.0+)
---
# vue/no-deprecated-model-definition

> disallow deprecated `model` definition (in Vue.js 3.0.0+)

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule reports use of the component `model` option, which has been deprecated in Vue.js 3.0.0+.

See [Migration Guide – `v-model`](https://v3-migration.vuejs.org/breaking-changes/v-model.html) for more details.

<eslint-code-block :rules="{'vue/no-deprecated-model-definition': ['error']}">

```vue
<script>
export default defineComponent({
  model: {
    prop: 'my-value',
    event: 'input'
  }
})
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-deprecated-model-definition": ["error", {
    "allowVue3Compat": true
  }]
}
```

### `"allowVue3Compat": true`

Allow `model` definitions with prop/event names that match the Vue.js 3.0.0+ `v-model` syntax, e.g. `fooBar`/`update:fooBar`.

<eslint-code-block :rules="{'vue/no-deprecated-model-definition': ['error', { allowVue3Compat: true }]}">

```vue
<script>
export default defineComponent({
  model: {
    prop: 'fooBar',
    event: 'update:fooBar'
  }
})
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/valid-model-definition](./valid-model-definition.md) (for Vue.js 2.x)
- [vue/no-v-model-argument](./no-v-model-argument.md) (for Vue.js 2.x)

## :books: Further Reading

- [Migration Guide – `v-model`](https://v3-migration.vuejs.org/breaking-changes/v-model.html)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-model-definition.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-model-definition.js)
