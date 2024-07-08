---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-macros-order
description: enforce order of `defineEmits` and `defineProps` compiler macros
since: v8.7.0
---

# vue/define-macros-order

> enforce order of `defineEmits` and `defineProps` compiler macros

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule reports the `defineProps` and `defineEmits` compiler macros when they are not the first statements in `<script setup>` (after any potential import statements or type definitions) or when they are not in the correct order.

## :wrench: Options

```json
{
  "vue/define-macros-order": ["error", {
    "order": ["defineProps", "defineEmits"],
    "defineExposeLast": false
  }]
}
```

- `order` (`string[]`) ... The order of defineEmits and defineProps macros. You can also add `"defineOptions"`, `"defineSlots"`, and `"defineModel"`.
- `defineExposeLast` (`boolean`) ... Force `defineExpose` at the end.

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

### `{ "order": ["defineOptions", "defineModel", "defineProps", "defineEmits", "defineSlots"] }`

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error', {order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots']}]}">

```vue
<!-- ✓ GOOD -->
<script setup>
defineOptions({/* ... */})
const model = defineModel()
defineProps(/* ... */)
defineEmits(/* ... */)
const slots = defineSlots()
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error', {order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots']}]}">

```vue
<!-- ✗ BAD -->
<script setup>
defineEmits(/* ... */)
const slots = defineSlots()
defineProps(/* ... */)
defineOptions({/* ... */})
const model = defineModel()
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error', {order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots']}]}">

```vue
<!-- ✗ BAD -->
<script setup>
const bar = ref()
defineOptions({/* ... */})
const model = defineModel()
defineProps(/* ... */)
defineEmits(/* ... */)
const slots = defineSlots()
</script>
```

</eslint-code-block>

### `{ "defineExposeLast": true }`

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error', {defineExposeLast: true}]}">

```vue
<!-- ✓ GOOD -->
<script setup>
defineProps(/* ... */)
defineEmits(/* ... */)
const slots = defineSlots()
defineExpose({/* ... */})
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/define-macros-order': ['error', {defineExposeLast: true}]}">

```vue
<!-- ✗ BAD -->
<script setup>
defineProps(/* ... */)
defineEmits(/* ... */)
defineExpose({/* ... */})
const slots = defineSlots()
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.7.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-macros-order.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-macros-order.js)
