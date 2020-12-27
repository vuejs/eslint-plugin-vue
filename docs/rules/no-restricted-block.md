---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-block
description: disallow specific block
since: v7.4.0
---
# vue/no-restricted-block

> disallow specific block

## :book: Rule Details

This rule allows you to specify block names that you don't want to use in your application.

## :wrench: Options

This rule takes a list of strings, where each string is a block name or pattern to be restricted:

```json
{
  "vue/no-restricted-block": ["error", "style", "foo", "bar"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-block': ['error', 'style', 'foo', 'bar']}">

```vue
<!-- ✗ BAD -->
<foo>
  Custom block
</foo>
<bar>
  Custom block
</bar>
<style>
.foo {}
</style>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-block": ["error",
    {
      "element": "style",
      "message": "Do not use <style> block in this project."
    },
    {
      "element": "foo",
      "message": "Do not use <foo> block in this project."
    },
    {
      "element": "/forbidden/",
      "message": "Do not use blocks that include `forbidden` in their name."
    }
  ]
}
```

The following properties can be specified for the object.

- `element` ... Specify the block element name or pattern.
- `message` ... Specify an optional custom message.

### `{ "element": "foo"  }, { "element": "/forbidden/"  }`

<eslint-code-block :rules="{'vue/no-restricted-block': ['error', { element: 'foo' }, { element: '/forbidden/' }]}">

```vue
<!-- ✗ BAD -->
<foo>
  ✗ BAD
</foo>
<forbidden-block></forbidden-block>
<block-forbidden></block-forbidden>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-block.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-block.js)
