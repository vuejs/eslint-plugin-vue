---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-props-declaration
description: enforce declaration style of `defineProps` and `defineModel`
since: v9.5.0
---

# vue/define-props-declaration

> enforce declaration style of `defineProps` and `defineModel`

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces which `defineProps` and `defineModel` declaration style you should use: `type-based` or `runtime`.

This rule only works in `<script setup>` and `<script lang="ts">`.

The autofix converts a runtime `defineProps` declaration to a type-based one only when this does not change how the props behave: each prop must be declared with native constructors (`String`, `Number`, `Boolean`, `Object`, `Array`, `Function`, `Symbol`, `Date`) or a `PropType` cast whose type uses no imported or local generic types and is inferred by the compiler as the same constructors, and use no options other than `type`, `required` and `default`. Default values are moved to `withDefaults()`. `defineModel` is not autofixed.

<eslint-code-block fix :rules="{'vue/define-props-declaration': ['error']}">

```vue
<script setup lang="ts">
/* ✓ GOOD */
const props = defineProps<{
  kind: string
  options: { title: string }
}>()
const model = defineModel<string>()

/* ✗ BAD */
const props = defineProps({
  kind: { type: String },
  options: { type: Object as PropType<{ title: string }> }
})
const model = defineModel({ type: String })
const untypedModel = defineModel()
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
const model = defineModel({ type: String })

/* ✗ BAD */
const props = defineProps<{
  kind: string
  options: { title: string }
}>()
const model = defineModel<string>()
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/define-emits-declaration](./define-emits-declaration.md)
- [vue/valid-define-props](./valid-define-props.md)

## :books: Further Reading

- [`defineProps`](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits)
- [`defineModel`](https://vuejs.org/api/sfc-script-setup.html#definemodel)
- [Typescript-only-features of `defineProps`](https://vuejs.org/api/sfc-script-setup.html#typescript-only-features)
- [Guide - Typing-component-props](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-props-declaration.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-props-declaration.test.ts)
