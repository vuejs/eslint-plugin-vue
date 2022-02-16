---
pageClass: rule-details
sidebarDepth: 0
title: vue/custom-event-name-casing
description: enforce specific casing for custom event name
since: v7.0.0
---
# vue/custom-event-name-casing

> enforce specific casing for custom event name

Define a style for custom event name casing for consistency purposes.

## :book: Rule Details

This rule aims to warn the custom event names other than the configured casing.

Vue 2 recommends using kebab-case for custom event names.

> Event names will never be used as variable or property names in JavaScript, so there’s no reason to use camelCase or PascalCase. Additionally, `v-on` event listeners inside DOM templates will be automatically transformed to lowercase (due to HTML’s case-insensitivity), so `v-on:myEvent` would become `v-on:myevent` – making `myEvent` impossible to listen to.
>
> For these reasons, we recommend you **always use kebab-case for event names**.

See [Guide (for v2) - Custom Events] for more details.

In Vue 3, using either camelCase or kebab-case for your custom event name does not limit its use in v-on. However, following JavaScript conventions, camelCase is more natural.

See [Guide - Custom Events] for more details.

This rule enforces kebab-case by default.

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

```json
{
  "vue/custom-event-name-casing": ["error",
    "kebab-case" | "camelCase",
    {
      "ignores": []
    }
  ]
}
```

- `"kebab-case"` (default) ... Enforce custom event names to kebab-case.
- `"camelCase"` ... Enforce custom event names to camelCase.
- `ignores` (`string[]`) ... The event names to ignore. Sets the event name to allow. For example, custom event names, Vue components event with special name, or Vue library component event name. You can set the regexp by writing it like `"/^name/"` or `click:row` or `fooBar`.

### `"kebab-case"`

<eslint-code-block :rules="{'vue/custom-event-name-casing': ['error', 'kebab-case']}">

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

      /* ✗ BAD */
      this.$emit('myEvent')
    }
  }
}
</script>
```

</eslint-code-block>

### `"camelCase"`

<eslint-code-block :rules="{'vue/custom-event-name-casing': ['error', 'camelCase']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button @click="$emit('myEvent')" />

  <!-- ✗ BAD -->
  <button @click="$emit('my-event')" />
</template>
<script>
export default {
  methods: {
    onClick () {
      /* ✓ GOOD */
      this.$emit('myEvent')

      /* ✗ BAD */
      this.$emit('my-event')
    }
  }
}
</script>
```

</eslint-code-block>

### `"ignores": ["fooBar", "/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u"]`

<eslint-code-block :rules="{'vue/custom-event-name-casing': ['error', { ignores: ['fooBar', '/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button @click="$emit('click:row')" />
  <button @click="$emit('fooBar')" />

  <!-- ✗ BAD -->
  <button @click="$emit('myEvent')" />
</template>
<script>
export default {
  methods: {
    onClick () {
      /* ✓ GOOD */
      this.$emit('click:row')
      this.$emit('fooBar')

      /* ✗ BAD */
      this.$emit('myEvent')
    }
  }
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [Guide - Custom Events]
- [Guide (for v2) - Custom Events]

[Guide - Custom Events]: https://vuejs.org/guide/components/events.html
[Guide (for v2) - Custom Events]: https://v2.vuejs.org/v2/guide/components-custom-events.html

## :couple: Related Rules

- [vue/v-on-event-hyphenation](./v-on-event-hyphenation.md)
- [vue/prop-name-casing](./prop-name-casing.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/custom-event-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/custom-event-name-casing.js)
