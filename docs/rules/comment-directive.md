---
pageClass: rule-details
sidebarDepth: 0
title: vue/comment-directive
description: support comment-directives in `<template>`
---
# vue/comment-directive
> support comment-directives in `<template>`

- :gear: This rule is included in all of `"plugin:vue/base"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-essential"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/recommended"` and `"plugin:vue/vue3-recommended"`.

Sole purpose of this rule is to provide `eslint-disable` functionality in the `<template>` and in the block level.
It supports usage of the following comments:

- `eslint-disable`
- `eslint-enable`
- `eslint-disable-line`
- `eslint-disable-next-line`

::: warning Note
We can't write HTML comments in tags.
:::

## :book: Rule Details

ESLint doesn't provide any API to enhance `eslint-disable` functionality and ESLint rules cannot affect other rules. But ESLint provides [processors API](https://eslint.org/docs/developer-guide/working-with-plugins#processors-in-plugins).

This rule sends all `eslint-disable`-like comments as errors to the post-process of the `.vue` file processor, then the post-process removes all `vue/comment-directive` errors and the reported errors in disabled areas.

<eslint-code-block :rules="{'vue/comment-directive': ['error'], 'vue/max-attributes-per-line': ['error']}">

```vue
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4" />
</template>
```

</eslint-code-block>

The `eslint-disable`-like comments can be used in the `<template>` and in the block level.

<eslint-code-block :rules="{'vue/comment-directive': ['error'], 'vue/max-attributes-per-line': ['error'], 'vue/component-tags-order': ['error'] }">

```vue
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4" />
</template>

<!-- eslint-disable-next-line vue/component-tags-order -->
<style>
</style>
```

</eslint-code-block>

The `eslint-disable` comments has no effect after one block.

<eslint-code-block :rules="{'vue/comment-directive': ['error'], 'vue/max-attributes-per-line': ['error'], 'vue/component-tags-order': ['error'] }">

```vue
<style>
</style>

<!-- eslint-disable -->
<script> /* <- Warning has been disabled. */
</script>

<template> <!-- <- Warning are not disabled. -->
</template>

```

</eslint-code-block>

The `eslint-disable`-like comments can include descriptions to explain why the comment is necessary. The description must occur after the directive and is separated from the directive by two or more consecutive `-` characters. For example:

<eslint-code-block :rules="{'vue/comment-directive': ['error'], 'vue/max-attributes-per-line': ['error']}">

```vue
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -- Here's a description about why this disabling is necessary. -->
  <div a="1" b="2" c="3" d="4" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/comment-directive": ["error", {
    "reportUnusedDisableDirectives": false
  }]
}
```

- `reportUnusedDisableDirectives` ... If `true`, to report unused `eslint-disable` HTML comments. default `false`

### `{ "reportUnusedDisableDirectives": true }`

<eslint-code-block :rules="{'vue/comment-directive': ['error', {reportUnusedDisableDirectives: true} ], 'vue/max-attributes-per-line': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4" />

  <!-- ✗ BAD -->
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" />
</template>
```

</eslint-code-block>

::: warning Note
Unused reports cannot be suppressed with `eslint-disable` HTML comments.
:::

## :books: Further Reading

- [Disabling rules with inline comments]

[Disabling rules with inline comments]: https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/comment-directive.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/comment-directive.js)
