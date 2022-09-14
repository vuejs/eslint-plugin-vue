---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-props-declaration
description: enforce type-based `defineProps`
---

# vue/define-props-declaration

> enforce type-based `defineProps`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>

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

<eslint-code-block :rules="{'vue/define-props-declaration': ['error']}">

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

- [vue/define-emits-declaration](./define-emits-declaration.md)
- [vue/valid-define-props](./valid-define-props.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-props-declaration.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-props-declaration.js)
