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

This rule reports the situation when `defineProps` or `defineEmits` not on the top or have wrong order

## :wrench: Options

```json
{
  "vue/define-macros-order": ["error", {
    "order": [ "defineEmits", "defineProps" ]
  }]
}
```

- `order` (`string[]`) ... The order of defineEmits and defineProps macros

### `{ "order": [ "defineEmits", "defineProps" ] }` (default)

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error']}">

```vue
<!-- ✓ GOOD -->
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
defineProps(/* ... */)
defineEmits(/* ... */)
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error']}">

```vue
<!-- ✗ BAD -->
<script setup>
const bar = ref()
defineEmits(/* ... */)
defineProps(/* ... */)
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-macros-order.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-macros-order.js)
