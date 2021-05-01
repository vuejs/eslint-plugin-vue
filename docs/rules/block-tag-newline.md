---
pageClass: rule-details
sidebarDepth: 0
title: vue/block-tag-newline
description: enforce line breaks after opening and before closing block-level tags
since: v7.1.0
---
# vue/block-tag-newline

> enforce line breaks after opening and before closing block-level tags

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a line break (or no line break) after opening and before closing block tags.

<eslint-code-block fix :rules="{'vue/block-tag-newline': ['error']}">

```vue
<!-- ✓ GOOD -->
<template><input></template>

<script>
export default {}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-tag-newline': ['error']}">

```vue
<!-- ✗ BAD -->
<template>
<input></template>

<script>
export default {}</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/block-tag-newline": ["error", {
    "singleline": "always" | "never" | "consistent" | "ignore",
    "multiline": "always" | "never" | "consistent" | "ignore",
    "maxEmptyLines": 0,
    "blocks": {
      "template": {
        "singleline": "always" | "never" | "consistent" | "ignore",
        "multiline": "always" | "never" | "consistent" | "ignore",
        "maxEmptyLines": 0,
      },
      "script": {
        "singleline": "always" | "never" | "consistent" | "ignore",
        "multiline": "always" | "never" | "consistent" | "ignore",
        "maxEmptyLines": 0,
      },
      "my-block": {
        "singleline": "always" | "never" | "consistent" | "ignore",
        "multiline": "always" | "never" | "consistent" | "ignore",
        "maxEmptyLines": 0,
      }
    }
  }]
}
```

- `singleline` ... the configuration for single-line blocks.
  - `"consistent"` ... (default) requires consistent usage of line breaks for each pair of tags. It reports an error if one tag in the pair has a linebreak inside it and the other tag does not.
  - `"always"` ... require one line break after opening and before closing block tags.
  - `"never"` ... disallow line breaks after opening and before closing block tags.
- `multiline` ... the configuration for multi-line blocks.
  - `"consistent"` ... requires consistent usage of line breaks for each pair of tags. It reports an error if one tag in the pair has a linebreak inside it and the other tag does not.
  - `"always"` ... (default) require one line break after opening and before closing block tags.
  - `"never"` ... disallow line breaks after opening and before closing block tags.
- `maxEmptyLines` ... specifies the maximum number of empty lines allowed. default 0.
- `blocks` ... specifies for each block name.

### `{ "singleline": "never", "multiline": "always" }`

<eslint-code-block fix :rules="{'vue/block-tag-newline': ['error', { 'singleline': 'never', 'multiline': 'always' }]}">

```vue
<!-- ✓ GOOD -->
<template><input></template>

<script>
export default {
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-tag-newline': ['error', { 'singleline': 'never', 'multiline': 'always' }]}">

```vue
<!-- ✗ BAD -->
<template>
<input>
</template>

<script>export default {
}</script>
```

</eslint-code-block>

### `{ "singleline": "always", "multiline": "always", "maxEmptyLines": 1 }`

<eslint-code-block fix :rules="{'vue/block-tag-newline': ['error', { 'singleline': 'always', 'multiline': 'always', 'maxEmptyLines': 1 }]}">

```vue
<!-- ✓ GOOD -->
<template>

<input>

</template>

<script>

export default {
}

</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/block-tag-newline': ['error', { 'singleline': 'always', 'multiline': 'always', 'maxEmptyLines': 1 }]}">

```vue
<!-- ✗ BAD -->
<template>


<input>


</template>

<script>


export default {
}


</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/block-tag-newline.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/block-tag-newline.js)
