---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-explicit-prop-requiredness
description: require an explicit required option in object-form props
---

# vue/require-explicit-prop-requiredness

> require an explicit required option in object-form props

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule requires object-form prop declarations to include a `required` option, even when they have a `default` value. It checks component `props` options and runtime `defineProps` declarations.

Vue props are optional by default. Enable this rule if your team prefers to state that choice explicitly with `required: false`, or to mark a prop as required with `required: true`. The rule checks only the presence of the option, not its value, and does not add it automatically.

<eslint-code-block :rules="{'vue/require-explicit-prop-requiredness': ['error']}">

```vue
<script>
export default {
  props: {
    // ✓ GOOD
    title: { type: String, required: true },
    enabled: { type: Boolean, required: false, default: true },

    // ✗ BAD
    label: { type: String },
    visible: { type: Boolean, default: true }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-explicit-prop-requiredness': ['error']}">

```vue
<script setup>
defineProps({
  // ✓ GOOD
  title: { type: String, required: true },
  enabled: { type: Boolean, required: false, default: true },

  // ✗ BAD
  label: { type: String },
  visible: { type: Boolean, default: true }
})
</script>
```

</eslint-code-block>

Constructor shorthand such as `foo: String`, arrays such as `props: ['foo']`, type-only declarations such as `defineProps<{ foo?: string }>()`, and `defineModel` are outside this rule's scope. Prop options referenced through variables or function calls are not checked.

Quoted and statically computed keys such as `'required'` and `['required']` count as explicit options. If a prop options object contains a spread or a computed key whose name cannot be determined, the rule skips it because that entry may supply `required`:

```js
const props = defineProps({
  foo: { type: String, ...options },
  bar: { type: String, [optionName]: true }
})
```

## :wrench: Options

Nothing.

## :books: Further Reading

- [Vue Guide - Prop Validation](https://vuejs.org/guide/components/props.html#prop-validation)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-explicit-prop-requiredness.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-explicit-prop-requiredness.test.ts)
