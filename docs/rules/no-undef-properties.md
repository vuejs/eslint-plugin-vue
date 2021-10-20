---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-undef-properties
description: disallow undefined properties
since: v7.20.0
---
# vue/no-undef-properties

> disallow undefined properties

## :book: Rule Details

This rule warns of using undefined properties.  
This rule can help you locate potential errors resulting from misspellings property names, and implicitly added properties.

::: warning Note
This rule cannot detect properties defined in other files or components.  
Note that there are many false positives if you are using mixins.
:::

<eslint-code-block :rules="{'vue/no-undef-properties': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ name }}: {{ count }}</div>
  <!-- ✗ BAD -->
  <div>{{ label }}: {{ cnt }}</div>
</template>
<script setup>
const prop = defineProps(['name', 'def'])
let count = 0

/* ✓ GOOD */
watch(() => prop.def, () => console.log('Updated!'))

/* ✗ BAD */
watch(() => prop.undef, () => console.log('Updated!'))
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-undef-properties': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ name }}: {{ count }}</div>
  <!-- ✗ BAD -->
  <div>{{ label }}: {{ cnt }}</div>
</template>
<script>
  export default {
    props: ['name'],
    data () {
      return {
        count: 0
      }
    },
    methods: {
      click() {
        /* ✓ GOOD */
        this.count++

        /* ✗ BAD */
        this.cnt++
      }
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-undef-properties": ["error", {
    "ignores": ["/^\\$/"]
  }]
}
```

- `ignores` (`string[]`) ... An array of property names or patterns that have already been defined property, or property to ignore from the check. Default is `["/^\\$/"]`.

### `"ignores": ["/^\\$/"]` (default)

<eslint-code-block :rules="{'vue/no-undef-properties': ['error', {ignores: ['/^\\$/']}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div>{{ $t('foo') }}</div>
</template>
<script>
  export default {
    mounted() {
      /* ✓ GOOD */
      const hash = this.$route.hash
    }
  }
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.20.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-undef-properties.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-undef-properties.js)
