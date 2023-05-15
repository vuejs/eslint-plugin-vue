---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-define-options
description: enforce valid `defineOptions` compiler macro
since: v9.13.0
---
# vue/valid-define-options

> enforce valid `defineOptions` compiler macro

This rule checks whether `defineOptions` compiler macro is valid.

## :book: Rule Details

This rule reports `defineOptions` compiler macros in the following cases:

- `defineOptions` is referencing locally declared variables.
- `defineOptions` has been called multiple times.
- Options are not defined in `defineOptions`.
- `defineOptions` has type arguments.
- `defineOptions` has `props`, `emits`, `expose` or `slots` options.

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script setup>
/* ✓ GOOD */
defineOptions({ name: 'foo' })
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script>
const def = { name: 'foo' }
</script>
<script setup>
/* ✓ GOOD */
defineOptions(def)
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script setup>
/* ✗ BAD */
const def = { name: 'foo' }
defineOptions(def)
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script setup>
/* ✗ BAD */
defineOptions({ name: 'foo' })
defineOptions({ inheritAttrs: false })
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script setup>
/* ✗ BAD */
defineOptions()
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script setup lang="ts">
/* ✗ BAD */
defineOptions<{ name: 'Foo' }>()
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-options': ['error']}">

```vue
<script setup>
/* ✗ BAD */
defineOptions({ props: { msg: String } })
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/valid-define-emits](./valid-define-emits.md)
- [vue/valid-define-props](./valid-define-props.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.13.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-define-options.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-define-options.js)
