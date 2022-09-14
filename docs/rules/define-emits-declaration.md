---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-emits-declaration
description: enforce type-based `defineEmits`
---

# vue/define-emits-declaration

> enforce type-based `defineEmits`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>

## :book: Rule Details

This rule forces developers to use the type-based declaration of `defineEmits` instead of runtime declaration.

This rule only works in setup script and `lang="ts"`.

```vue
<script setup lang="ts">
/* ✓ GOOD */
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

<eslint-code-block :rules="{'vue/define-emits-declaration': ['error']}">

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

- [vue/define-props-declaration](./define-props-declaration.md)
- [vue/valid-define-emits](./valid-define-emits.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-emits-declaration.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-emits-declaration.js)
