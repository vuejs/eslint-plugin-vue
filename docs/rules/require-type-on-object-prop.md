---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-type-on-object-prop
description: enforce adding type declarations to object props
---
# vue/require-type-on-object-prop

> enforce adding type declarations to object props

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

Prevent missing type declarations for non-primitive object props in TypeScript projects.

<eslint-code-block :rules="{'vue/require-type-on-object-prop': ['error']}">

```vue
<script lang="ts">
export default {
  props: {
    prop: {
      // ✗ BAD
      type: Object,
      type: Array,
      
      // ✓ GOOD
      type: Object as PropType<Anything>,
      type: Array as PropType<Anything[]>,
      type: String, // or any other primitive type
    }
  }
}
</script>

</eslint-code-block>

### Options

Nothing.

## :mute: When Not To Use It

When you're not using TypeScript in the project.

## :books: Further Reading

Nothing

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-type-on-object-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-type-on-object-prop.js)
