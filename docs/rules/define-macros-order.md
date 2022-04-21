---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-macros-order
description: enforce order of `defineEmits` and `defineProps` compiler macros
---
# vue/define-macros-order

> enforce order of `defineEmits` and `defineProps` compiler macros

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports the `defineProps` and `defineEmits` compiler macros when they are not the first statements in `<script setup>` (after any potential import statements or type definitions) or when they are not in the correct order.

## :wrench: Options

```json
{
  "vue/define-macros-order": ["error", {
    "order": ["defineProps", "defineEmits"]
  }]
}
```

- `order` (`string[]`) ... The order of defineEmits and defineProps macros

### `{ "order": ["defineProps", "defineEmits"] }` (default)

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error']}">

```vue
<!-- ✓ GOOD -->
<script setup>
defineProps(/* ... */)
defineEmits(/* ... */)
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error']}">

```vue
<!-- ✗ BAD -->
<script setup>
defineEmits(/* ... */)
defineProps(/* ... */)
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error']}">

```vue
<!-- ✗ BAD -->
<script setup>
const bar = ref()
defineProps(/* ... */)
defineEmits(/* ... */)
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-macros-order.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-macros-order.js)
