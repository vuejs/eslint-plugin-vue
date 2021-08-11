---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-define-props
description: enforce valid `defineProps` compiler macro
since: v7.13.0
---
# vue/valid-define-props

> enforce valid `defineProps` compiler macro

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

This rule checks whether `defineProps` compiler macro is valid.

## :book: Rule Details

This rule reports `defineProps` compiler macros in the following cases:

- `defineProps` are referencing locally declared variables.
- `defineProps` has both a literal type and an argument. e.g. `defineProps<{/*props*/}>({/*props*/})`
- `defineProps` has been called multiple times.
- Props are defined in both `defineProps` and `export default {}`.
- Props are not defined in either `defineProps` or `export default {}`.

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script setup>
  /* ✓ GOOD */
  defineProps({ msg: String })
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script setup>
  /* ✓ GOOD */
  defineProps(['msg'])
</script>
```

</eslint-code-block>

```vue
<script setup lang="ts">
  /* ✓ GOOD */
  defineProps<{ msg?:string }>()
</script>
```

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script>
  const def = { msg: String }
</script>
<script setup>
  /* ✓ GOOD */
  defineProps(def)
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script setup>
  /* ✗ BAD */
  const def = { msg: String }
  defineProps(def)
</script>
```

</eslint-code-block>

```vue
<script setup lang="ts">
  /* ✗ BAD */
  defineProps<{ msg?:string }>({ msg: String })
</script>
```

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script setup>
  /* ✗ BAD */
  defineProps({ msg: String })
  defineProps({ count: Number })
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script>
  export default {
    props: { msg: String }
  }
</script>
<script setup>
  /* ✗ BAD */
  defineProps({ count: Number })
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-define-props': ['error']}">

```vue
<script setup>
  /* ✗ BAD */
  defineProps()
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.13.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-define-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-define-props.js)
