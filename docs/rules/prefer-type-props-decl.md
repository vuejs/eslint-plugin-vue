---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-type-props-decl
description: enforce type-based `defineProps`
---
# vue/prefer-type-props-decl

> enforce type-based `defineProps`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule forces developers to use the type-based declaration of `defineProps` instead of runtime declaration.

This rule only works in setup script and `lang="ts"`.

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps<{
  kind: string
}>()
</script>
```

<eslint-code-block :rules="{'vue/prefer-type-props-decl': ['error']}">

```vue
<script setup lang="ts">
/* ✗ BAD */
const props = defineProps({
  kind: { type: String }
})
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/prefer-type-emits-decl](./prefer-type-emits-decl.md)
- [vue/valid-define-props](./valid-define-props.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-type-props-decl.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-type-props-decl.js)
