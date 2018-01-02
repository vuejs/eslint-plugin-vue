# support comment-directives in `<template>` (comment-directive)

This rule supports the following comment directives in `<template>`:

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

This rule doesn't make any warning.

## Further reading

- [Disabling rules with inline comments](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
