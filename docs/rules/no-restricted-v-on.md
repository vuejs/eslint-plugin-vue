---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-v-on
description: disallow specific argument in `v-on`
---
# vue/no-restricted-v-on

> disallow specific argument in `v-on`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule allows you to specify `v-on` argument names that you don't want to use in your application.

## :wrench: Options

This rule takes a list of strings, where each string is a argument name or pattern to be restricted:

```json
{
  "vue/no-restricted-v-on": ["error", "foo", "bar"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-v-on': ['error', 'foo', 'bar']}">

```vue
<template>
  <!-- ✗ BAD -->
  <div v-on:foo="x" />
  <div @bar="x" />
</template>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-v-on": [
    "error",
    {
      "argument": "foo",
      "message": "Use \"v-on:x\" instead."
    },
    {
      "argument": "bar",
      "message": "\"@bar\" is deprecated."
    }
  ]
}
```

The following properties can be specified for the object.

- `argument` ... Specify the argument name or pattern or `null`. If `null` is specified, it matches `v-on=`.
- `modifiers` ... Specifies an array of the modifier names. If specified, it will only be reported if the specified modifier is used.
- `element` ... Specify the element name or pattern. If specified, it will only be reported if used on the specified element.
- `message` ... Specify an optional custom message.

### `{ "argument": "foo", "modifiers": ["prevent"]  }`

<eslint-code-block :rules="{'vue/no-restricted-v-on': ['error', { argument: 'foo', modifiers: ['prevent'] }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div @foo="x" />

  <!-- ✗ BAD -->
  <div @foo.prevent="x" />
</template>
```

</eslint-code-block>

### `{ "argument": "foo", "element": "MyButton"  }`

<eslint-code-block :rules="{'vue/no-restricted-v-on': ['error', { argument: 'foo', element: 'MyButton' }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <CoolButton @foo="x" />

  <!-- ✗ BAD -->
  <MyButton @foo="x" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-restricted-static-attribute]

[vue/no-restricted-static-attribute]: ./no-restricted-static-attribute.md

- [vue/no-restricted-v-bind]

[vue/no-restricted-v-bind]: ./no-restricted-v-bind.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-v-on.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-v-on.js)
