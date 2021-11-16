---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-custom-event
description: disallow specific custom event
since: v7.3.0
---
# vue/no-restricted-custom-event

> disallow specific custom event

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule allows you to specify custom event that you don't want to use in your application.

## :wrench: Options

This rule takes a list of strings, where each string is a custom event name or pattern to be restricted:

```json
{
  "vue/no-restricted-custom-event": ["error", "input", "/^forbidden/"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-custom-event': ['error', 'input', '/^forbidden/']}">

```vue
<template>
  <!-- ✗ BAD -->
  <input @input="$emit('input', $event.target.value)">
  <!-- ✗ GOOD -->
  <input @input="$emit('update:value', $event.target.value)">
</template>
<script>
export default {
  methods: {
    handleChangeValue(newValue) {
      /* ✗ BAD */
      this.$emit('input', newValue)
      this.$emit('forbiddenEvent')

      /* ✓ GOOD */
      this.$emit('foo')
      this.$emit('bar')
    }
  }
}
</script>
```

</eslint-code-block>


Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-custom-event": ["error",
    {
      "event": "input",
      "message": "If you intend a prop for v-model, it should be 'update:modelValue' in Vue 3.",
      "suggest": "update:modelValue"
    },
  ]
}
```

The following properties can be specified for the object.

- `event` ... Specify the event name or pattern.
- `message` ... Specify an optional custom message.
- `suggest` ... Specify an optional name to suggest changes.

<eslint-code-block :rules="{'vue/no-restricted-custom-event': ['error', { event: 'input', message: 'If you intend a prop for v-model, it should be \'update:modelValue\' in Vue 3.', suggest: 'update:modelValue'}]}">

```vue
<template>
  <!-- ✗ BAD -->
  <input @input="$emit('input', $event.target.value)">
</template>
<script>
export default {
  methods: {
    handleChangeValue(newValue) {
      /* ✗ BAD */
      this.$emit('input', newValue)
    }
  }
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.3.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-custom-event.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-custom-event.js)
