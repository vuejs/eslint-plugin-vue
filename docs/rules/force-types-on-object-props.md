---
pageClass: rule-details
sidebarDepth: 0
title: vue/force-types-on-object-props
description: enforce adding type declarations to object props
---
# vue/force-types-on-object-props

> enforce adding type declarations to object props

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/base"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-essential"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

Prevent missing type declarations for non-primitive object props in TypeScript projects.

<eslint-code-block :rules="{'vue/force-types-on-object-props': ['error']}">

```ts
export default {
  props: {
    prop: {
      // ✗ BAD
      type: Object,
      type: Array,
      
      // ✓ GOOD
      type: Object as Props<Anything>,
      type: String, // or any other primitive type
    }
  }
}
```

</eslint-code-block>

### Options

Nothing.

## :mute: When Not To Use It

When you're not using TypeScript in the project.

## :books: Further Reading

Nothing

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/force-types-on-object-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/force-types-on-object-props.js)
