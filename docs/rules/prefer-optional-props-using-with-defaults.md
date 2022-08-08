---
pageClass: rule-details
sidebarDepth: 0
title: vue/prefer-optional-props-using-with-defaults
description: enforce props with default values ​​to be optional
---
# vue/prefer-optional-props-using-with-defaults

> enforce props with default values ​​to be optional

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

If a prop is declared with a default value, whether it is required or not, we can always skip it in actual use. In that situation, the default value would be applied.
So, a required prop with a default value is essentially the same as an optional prop.
This rule enforces all props with default values to be optional.

<eslint-code-block fix :rules="{'vue/prefer-optional-props-using-with-defaults': ['error', { autoFix: true }]}">

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

<eslint-code-block fix :rules="{'vue/prefer-optional-props-using-with-defaults': ['error', { autoFix: true }]}">

```vue
<script setup lang="ts">
  export default {
    /* ✓ GOOD */
    props: {
      name: {
        required: true,
        default: 'Hello'
      }
    }

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
  "vue/prefer-optional-props-using-with-defaults": ["error", {
    "autofix": false,
  }]
}
```

- `"autofix"` ... If `true`, enable autofix.

## :couple: Related Rules

- [vue/require-default-prop](./require-default-prop.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/prefer-optional-props-using-with-defaults.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/prefer-optional-props-using-with-defaults.js)
