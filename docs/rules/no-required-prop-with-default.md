---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-required-prop-with-default
description: enforce props with default values ​​to be optional
since: v9.6.0
---
# vue/no-required-prop-with-default

> enforce props with default values ​​to be optional

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

If a prop is declared with a default value, whether it is required or not, we can always skip it in actual use. In that situation, the default value would be applied.
So, a required prop with a default value is essentially the same as an optional prop.
This rule enforces all props with default values to be optional.

<eslint-code-block fix :rules="{'vue/no-required-prop-with-default': ['error', { autofix: true }]}">

```vue
<script setup lang="ts">
  /* ✓ GOOD */
  const props = withDefaults(
    defineProps<{
      name?: string | number
      age?: number
    }>(),
    {
      name: "Foo",
    }
  );

  /* ✗ BAD */
  const props = withDefaults(
    defineProps<{
      name: string | number
      age?: number
    }>(),
    {
      name: "Foo",
    }
  );
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/no-required-prop-with-default': ['error', { autofix: true }]}">

```vue
<script>
  export default {
    /* ✓ GOOD */
    props: {
      name: {
        required: true,
        default: 'Hello'
      }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/no-required-prop-with-default': ['error', { autofix: true }]}">

```vue
<script>
  export default {
    /* ✗ BAD */
    props: {
      name: {
        required: true,
        default: 'Hello'
      }
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-required-prop-with-default": ["error", {
    "autofix": false,
  }]
}
```

- `"autofix"` ... If `true`, enable autofix. (Default: `false`)

## :couple: Related Rules

- [vue/require-default-prop](./require-default-prop.md)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.6.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-required-prop-with-default.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-required-prop-with-default.js)
