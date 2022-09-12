---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-type-emits-decl
description: enforce type-based `defineEmits`
---
# vue/prefer-type-emits-decl

> enforce type-based `defineEmits`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule forces developers to use the type-based declaration of `defineEmits` instead of runtime declaration.

This rule only works in setup script and `lang="ts"`.

<eslint-code-block :rules="{'vue/prefer-type-emits-decl': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/prefer-type-emits-decl': ['error']}">

```vue
<script setup lang="ts">
/* ✗ BAD */
const emit = defineEmits(['change', 'update'])
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/prefer-type-props-decl](./prefer-type-props-decl.md)
- [vue/valid-define-props](./valid-define-props.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-type-emits-decl.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-type-emits-decl.js)
