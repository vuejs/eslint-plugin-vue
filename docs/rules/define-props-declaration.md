---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-props-declaration
description: enforce declaration style of `defineProps`
since: v9.5.0
---
# vue/define-props-declaration

> enforce declaration style of `defineProps`

## :book: Rule Details

This rule enforces `defineProps` typing style which you should use `type-based` or `runtime` declaration.

This rule only works in setup script and `lang="ts"`.

<eslint-code-block :rules="{'vue/define-props-declaration': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps<{
  kind: string
}>()

/* ✗ BAD */
const props = defineProps({
  kind: { type: String }
})
</script>
```

</eslint-code-block>

## :wrench: Options

```json
  "vue/define-props-declaration": ["error", "type-based" | "runtime"]
```

- `type-based` (default) enforces type-based declaration
- `runtime` enforces runtime declaration

### `"runtime"`

<eslint-code-block :rules="{'vue/define-emits-declaration': ['error', 'runtime']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps({
  kind: { type: String }
})

/* ✗ BAD */
const props = defineProps<{
  kind: string
}>()
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/define-emits-declaration](./define-emits-declaration.md)
- [vue/valid-define-props](./valid-define-props.md)

## :books: Further Reading

- [`defineProps`](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits)
- [Typescript-only-features of `defineProps`](https://vuejs.org/api/sfc-script-setup.html#typescript-only-features)
- [Guide - Typing-component-props](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-props-declaration.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-props-declaration.js)
