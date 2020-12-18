---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-static-attribute
description: disallow specific attribute
---
# vue/no-restricted-static-attribute
> disallow specific attribute

## :book: Rule Details

This rule allows you to specify attribute names that you don't want to use in your application.

## :wrench: Options

This rule takes a list of strings, where each string is a attribute name or pattern to be restricted:

```json
{
  "vue/no-restricted-static-attribute": ["error", "foo", "bar"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-static-attribute': ['error', 'foo', 'bar']}">

```vue
<template>
  <!-- ✗ BAD -->
  <div foo="x" />
  <div bar />
</template>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-static-attribute": ["error",
    {
      "key": "stlye",
      "message": "Using \"stlye\" is not allowed. Use \"style\" instead."
    }
  ]
}
```

The following properties can be specified for the object.

- `key` ... Specify the attribute key name or pattern.
- `value` ... Specify the value text or pattern or `true`. If specified, it will only be reported if the specified value is used. If `true`, it will only be reported if there is no value or if the value and key are same.
- `element` ... Specify the element name or pattern. If specified, it will only be reported if used on the specified element.
- `message` ... Specify an optional custom message.

### `{ "key": "foo", "value": "bar"  }`

<eslint-code-block :rules="{'vue/no-restricted-static-attribute': ['error', { key: 'foo', value: 'bar' }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div foo="foo" />

  <!-- ✗ BAD -->
  <div foo="bar" />
</template>
```

</eslint-code-block>

### `{ "key": "foo", "element": "MyButton"  }`

<eslint-code-block :rules="{'vue/no-restricted-static-attribute': ['error', { key: 'foo', element: 'MyButton' }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <CoolButton foo="x" />

  <!-- ✗ BAD -->
  <MyButton foo="x" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/no-restricted-v-bind]

[vue/no-restricted-v-bind]: ./no-restricted-v-bind.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-static-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-static-attribute.js)
