---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-emits-declaration
description: enforce declaration style of `defineEmits`
---
# vue/define-emits-declaration

> enforce declaration style of `defineEmits`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule enforces `defineEmits` typing style which you should use `type-based` or `runtime` declaration.

This rule only works in setup script and `lang="ts"`.

<eslint-code-block :rules="{'vue/define-emits-declaration': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

/* ✗ BAD */
const emit = defineEmits(['change', 'update'])
</script>
```

</eslint-code-block>

## :wrench: Options

```json
  "vue/define-emits-declaration": ["error", "type-based" | "runtime"]
```

- `type-based` (default) enforces type-based declaration
- `runtime` enforces runtime declaration

### `runtime`

<eslint-code-block :rules="{'vue/define-emits-declaration': ['error', 'runtime']}">

```vue
<script setup lang="ts">
/* ✗ BAD */
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

/* ✓ GOOD */
const emit = defineEmits(['change', 'update'])
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/define-props-declaration](./define-props-declaration.md)
- [vue/valid-define-emits](./valid-define-emits.md)

## :books: Further Reading

- [`defineEmits`](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits)
- [Typescript-only-features of `defineEmits`](https://vuejs.org/api/sfc-script-setup.html#typescript-only-features)
- [Guide - Typing-component-emits](https://vuejs.org/guide/typescript/composition-api.html#typing-component-emits)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-emits-declaration.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-emits-declaration.js)
