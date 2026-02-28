---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-html-elements
description: disallow specific elements
since: v8.6.0
---

# vue/no-restricted-html-elements

> disallow specific elements

## :book: Rule Details

This rule allows you to specify HTML, SVG, and MathML elements that you don't want to use in your application.

<eslint-code-block :rules="{'vue/no-restricted-html-elements': ['error', 'marquee', 'button'] }">

```vue
<template>
  <!-- ✓ GOOD -->
  <p></p>
  <input />
  <br />

  <!-- ✗ BAD -->
  <button></button>
  <marquee></marquee>
</template>
```

</eslint-code-block>

## :wrench: Options

This rule takes a list of strings, where each string is an element name to be restricted:

```json
{
  "vue/no-restricted-html-elements": ["error", "a", "marquee"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-html-elements': ['error', 'a', 'marquee']}">

```vue
<template>
  <!-- ✗ BAD -->
  <a></a>
  <marquee></marquee>
</template>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-html-elements": [
    "error",
    {
      "element": ["a", "RouterLink"],
      "message": "Prefer the use of <NuxtLink> component"
    },
    {
      "element": "marquee",
      "message": "Do not use deprecated HTML tags"
    }
  ]
}
```

The following properties can be specified for the object.

- `element` ... Specify the element name or an array of element names.
- `message` ... Specify an optional custom message.

### `{ "element": "marquee" }, { "element": "a" }`

<eslint-code-block :rules="{'vue/no-restricted-html-elements': ['error', { element: 'marquee' }, { element: 'a' }]}">

```vue
<template>
  <!-- ✗ BAD -->
  <marquee></marquee>
  <a></a>
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.6.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-html-elements.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-html-elements.js)
