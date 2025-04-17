---
pageClass: rule-details
sidebarDepth: 0
title: vue/define-props-destructuring
description: enforce consistent style for props destructuring
---

# vue/define-props-destructuring

> enforce consistent style for props destructuring

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule enforces a consistent style for handling Vue 3 Composition API props, allowing you to choose between requiring destructuring or prohibiting it.

By default, the rule requires you to use destructuring syntax when using `defineProps` instead of storing props in a variable and warns against combining `withDefaults` with destructuring.

<eslint-code-block :rules="{'vue/define-props-destructuring': ['error']}">

```vue
<script setup>
  // ✓ GOOD
  const { foo } = defineProps(['foo'])
  const { bar = 'default' } = defineProps(['bar'])

  // ✗ BAD
  const props = defineProps(['foo'])
  const propsWithDefaults = withDefaults(defineProps(['foo']), { foo: 'default' })

  // ✗ BAD
  const { baz } = withDefaults(defineProps(['baz']), { baz: 'default' })
</script>
```

</eslint-code-block>

The rule applies to both JavaScript and TypeScript props:

<eslint-code-block :rules="{'vue/define-props-destructuring': ['error']}">

```vue
<script setup lang="ts">
  // ✓ GOOD
  const { foo } = defineProps<{ foo?: string }>()
  const { bar = 'default' } = defineProps<{ bar?: string }>()

  // ✗ BAD
  const props = defineProps<{ foo?: string }>()
  const propsWithDefaults = withDefaults(defineProps<{ foo?: string }>(), { foo: 'default' })
</script>
```

</eslint-code-block>

## :wrench: Options

```js
{
  "vue/define-props-destructuring": ["error", {
    "destructure": "always" | "never"
  }]
}
```

- `destructure` - Sets the destructuring preference for props
  - `"always"` (default) - Requires destructuring when using `defineProps` and warns against using `withDefaults` with destructuring
  - `"never"` - Requires using a variable to store props and prohibits destructuring

### `"destructure": "never"`

<eslint-code-block :rules="{'vue/define-props-destructuring': ['error', { destructure: 'never' }]}">

```vue
<script setup>
  // ✓ GOOD
  const props = defineProps(['foo'])
  const propsWithDefaults = withDefaults(defineProps(['foo']), { foo: 'default' })

  // ✗ BAD
  const { foo } = defineProps(['foo'])
</script>
```

</eslint-code-block>

## :books: Further Reading

- [Reactive Props Destructure](https://vuejs.org/guide/components/props.html#reactive-props-destructure)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/define-props-destructuring.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/define-props-destructuring.js)
