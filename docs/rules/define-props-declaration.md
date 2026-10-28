---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-props-declaration
description: enforce declaration style of `defineProps` and `defineModel`
since: v9.5.0
---

# vue/define-props-declaration

> enforce declaration style of `defineProps` and `defineModel`

## :book: Rule Details

This rule enforces the use of either `type-based` or `runtime` declarations for `defineProps` and `defineModel`.

This rule only works in setup script and `lang="ts"`.

<eslint-code-block :rules="{'vue/define-props-declaration': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps<{
  kind: string
  options: { title: string }
}>()
const model = defineModel<string>()
const title = defineModel<string>('title', { required: true })

/* ✗ BAD */
const props = defineProps({
  kind: { type: String },
  options: { type: Object as PropType<{ title: string }> }
})
const model = defineModel()
const title = defineModel('title', { type: String })
</script>
```

</eslint-code-block>

## :wrench: Options

```json
  "vue/define-props-declaration": ["error", "type-based" | "runtime"]
```

- `type-based` (default) enforces type-based declarations. Each `defineModel` call must have an explicit type parameter, even when it has no options. Model names and options such as `required`, `default`, `get`, and `set` are allowed alongside the type parameter.
- `runtime` enforces runtime declarations without type parameters.

### `"runtime"`

<eslint-code-block :rules="{'vue/define-props-declaration': ['error', 'runtime']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps({
  kind: { type: String },
  options: { type: Object as PropType<{ title: string }> }
})
const model = defineModel({ type: String })
const title = defineModel('title', { type: String, required: true })

/* ✗ BAD */
const props = defineProps<{
  kind: string
  options: { title: string }
}>()
const model = defineModel<string>()
const title = defineModel<string>('title', { required: true })
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
- [`defineModel`](https://vuejs.org/api/sfc-script-setup.html#definemodel)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-props-declaration.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-props-declaration.test.ts)
