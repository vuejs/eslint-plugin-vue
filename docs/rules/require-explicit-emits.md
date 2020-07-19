---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-explicit-emits
description: require `emits` option with name triggered by `$emit()`
---
# vue/require-explicit-emits
> require `emits` option with name triggered by `$emit()`

## :book: Rule Details

This rule reports event triggers not declared with the `emits` option. (The `emits` option is a new in Vue.js 3.0.0+)

Explicit `emits` declaration serves as self-documenting code. This can be useful for other developers to instantly understand what events the component is supposed to emit.
Also,  with attribute fallthrough changes in Vue.js 3.0.0+, `v-on` listeners on components will fallthrough as native listeners by default. Declare it as a component-only event in `emits` to avoid unnecessary registration of native listeners.

<eslint-code-block :rules="{'vue/require-explicit-emits': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div @click="$emit('good')"/>
  <!-- ✗ BAD -->
  <div @click="$emit('bad')"/>
</template>
<script>
export default {
  emits: ['good']
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-emits': ['error']}">

```vue
<script>
export default {
  emits: ['good'],
  methods: {
    foo () {
      // ✓ GOOD
      this.$emit('good')
      // ✗ BAD
      this.$emit('bad')
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-emits': ['error']}">

```vue
<script>
export default {
  emits: ['good'],
  setup (props, context) {
    // ✓ GOOD
    context.emit('good')
    // ✗ BAD
    context.emit('bad')
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Custom Events / Defining Custom Events](https://v3.vuejs.org/guide/component-custom-events.html#defining-custom-events)
- [Vue RFCs - 0030-emits-option](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-explicit-emits.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-explicit-emits.js)
