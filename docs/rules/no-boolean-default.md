---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-boolean-default
description: disallow boolean defaults
---
# vue/no-boolean-default
> disallow boolean defaults

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

The rule prevents Boolean props from having a default value.


## :book: Rule Details
The rule is to enforce the HTML standard of always defaulting boolean attributes to false.

<eslint-code-block fix :rules="{'vue/no-boolean-default': ['error']}">

```vue
<script>
export default {
  props: {
    foo: {
      type: Boolean,
      default: true
    },
    bar: {
      type: Boolean
    }
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options
- `'no-default'` (default) allows a prop definition object, but enforces that the `default` property not be defined.
- `'default-false'` enforces that the default can be set but must be set to `false`.

```json
  "vue/no-boolean-default": ["error", "no-default|default-false"]
```

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-boolean-default.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-boolean-default.js)
