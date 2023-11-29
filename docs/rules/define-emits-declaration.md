---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-emits-declaration
description: enforce declaration style of `defineEmits`
since: v9.5.0
---
# vue/define-emits-declaration

> enforce declaration style of `defineEmits`

## :book: Rule Details

This rule enforces `defineEmits` typing style which you should use `type-based`, strict `type-literal`
(introduced in Vue 3.3), or `runtime` declaration.

This rule only works in setup script and `lang="ts"`.

<eslint-code-block :rules="{'vue/define-emits-declaration': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

/* ✓ GOOD */
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()

/* ✗ BAD */
const emit = defineEmits({
  change: (id) => typeof id == 'number',
  update: (value) => typeof value == 'string'
})

/* ✗ BAD */
const emit = defineEmits(['change', 'update'])
</script>
```

</eslint-code-block>

## :wrench: Options

```json
  "vue/define-emits-declaration": ["error", "type-based" | "type-literal" | "runtime"]
```

- `type-based` (default) enforces type based declaration
- `type-literal` enforces strict "type literal" type based declaration
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
const emit = defineEmits({
  change: (id) => typeof id == 'number',
  update: (value) => typeof value == 'string'
})

/* ✓ GOOD */
const emit = defineEmits(['change', 'update'])
</script>
```

</eslint-code-block>

### `type-literal`

<eslint-code-block :rules="{'vue/define-emits-declaration': ['error', 'type-literal']}">

```vue
<script setup lang="ts">
/* ✗ BAD */
const emit = defineEmits(['change', 'update'])

/* ✗ BAD */
const emit = defineEmits({
  change: (id) => typeof id == 'number',
  update: (value) => typeof value == 'string'
})

/* ✗ BAD */
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

/* ✓ GOOD */
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
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

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-emits-declaration.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-emits-declaration.js)
