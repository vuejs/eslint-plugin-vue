---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-props-declaration
description: enforce declaration style of `defineProps`
since: v9.5.0
---

# vue/define-props-declaration

> enforce declaration style of `defineProps`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces `defineProps` typing style which you should use `type-based` or `runtime` declaration.

This rule only works in setup script and `lang="ts"`.

The autofix converts a runtime declaration to a type-based one only when this does not change how the props behave: each prop must be declared with native constructors (`String`, `Number`, `Boolean`, `Object`, `Array`, `Function`, `Symbol`, `Date`) or a `PropType` cast, and use no options other than `type`, `required` and `default`. Default values are moved to `withDefaults()`.

<eslint-code-block fix :rules="{'vue/define-props-declaration': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps<{
  kind: string
  options: { title: string }
}>()

/* ✗ BAD */
const props = defineProps({
  kind: { type: String },
  options: { type: Object as PropType<{ title: string }> }
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

<eslint-code-block fix :rules="{'vue/define-props-declaration': ['error', 'runtime']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps({
  kind: { type: String },
  options: { type: Object as PropType<{ title: string }> }
})

/* ✗ BAD */
const props = defineProps<{
  kind: string
  options: { title: string }
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

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-props-declaration.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-props-declaration.test.ts)
