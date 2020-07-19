---
pageClass: rule-details
sidebarDepth: 0
title: vue/custom-event-name-casing
description: enforce custom event names always use "kebab-case"
---
# vue/custom-event-name-casing
> enforce custom event names always use "kebab-case"

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule enforces using kebab-case custom event names.

> Event names will never be used as variable or property names in JavaScript, so there’s no reason to use camelCase or PascalCase. Additionally, `v-on` event listeners inside DOM templates will be automatically transformed to lowercase (due to HTML’s case-insensitivity), so `v-on:myEvent` would become `v-on:myevent` – making `myEvent` impossible to listen to.
>
> For these reasons, we recommend you **always use kebab-case for event names**.

See [Guide - Custom Events] for more details.

<eslint-code-block :rules="{'vue/custom-event-name-casing': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button @click="$emit('my-event')" />

  <!-- ✗ BAD -->
  <button @click="$emit('myEvent')" />
</template>
<script>
export default {
  methods: {
    onClick () {
      /* ✓ GOOD */
      this.$emit('my-event')
      this.$emit('update:myProp', myProp)

      /* ✗ BAD */
      this.$emit('myEvent')
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further Reading

- [Guide - Custom Events]

[Guide - Custom Events]: https://v3.vuejs.org/guide/component-custom-events.html
[Guide (for v2) - Custom Events]: https://vuejs.org/v2/guide/components-custom-events.html

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/custom-event-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/custom-event-name-casing.js)
