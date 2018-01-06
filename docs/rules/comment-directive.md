# support comment-directives in `<template>` (comment-directive)

Sole purpose of this rule is to provide `eslint-disable` functionality in `<template>`.
It supports usage of the following comments:

- `eslint-disable`
- `eslint-enable`
- `eslint-disable-line`
- `eslint-disable-next-line`

For example:

```html
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4">
  </div>
</template>
```

> Note: we can't write HTML comments in tags.

This rule doesn't throw any warning.

## :book: Rule Details

ESLint doesn't provide any API to enhance `eslint-disable` functionality and ESLint rules cannot affect other rules. But ESLint provides [processors API](https://eslint.org/docs/developer-guide/working-with-plugins#processors-in-plugins).

This rule sends all `eslint-disable`-like comments as errors to the post-process of the `.vue` file processor, then the post-process removes all `vue/comment-directive` errors and the reported errors in disabled areas.

## :books: Further reading

- [Disabling rules with inline comments](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
