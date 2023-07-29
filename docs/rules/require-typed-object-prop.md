---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-typed-object-prop
description: enforce adding type declarations to object props
since: v9.16.0
---
# vue/require-typed-object-prop

> enforce adding type declarations to object props

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

Prevent missing type declarations for non-primitive object props in TypeScript projects.

<eslint-code-block :rules="{'vue/require-typed-object-prop': ['error']}">

```vue
<script lang="ts">
export default {
  props: {
    // ✗ BAD
    bad1: Object,
    bad2: { type: Array },
      
    // ✓ GOOD
    good1: Object as PropType<Anything>,
    good2: { type: Array as PropType<Anything[]> },
    good3: [String, Boolean], // or any other primitive type
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mute: When Not To Use It

When you're not using TypeScript in the project.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.16.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-typed-object-prop.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-typed-object-prop.js)
