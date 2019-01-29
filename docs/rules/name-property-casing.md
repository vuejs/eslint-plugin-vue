---
pageClass: rule-details
sidebarDepth: 0
title: vue/name-property-casing
description: enforce specific casing for the name property in Vue components
---
# vue/name-property-casing
> enforce specific casing for the name property in Vue components

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims at enforcing the style for the `name` property casing for consistency purposes.

<eslint-code-block fix :rules="{'vue/name-property-casing': ['error']}">

```vue
<script>
  /* ✓ GOOD */
  export default {
    name: 'MyComponent'
  }
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/name-property-casing': ['error']}">

```vue
<script>
  /* ✗ BAD */
  export default {
    name: 'my-component'
  }
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/name-property-casing": ["error", "PascalCase" | "kebab-case"]
}
```

- `"PascalCase"` (default) ... Enforce the `name` property to Pascal case.
- `"kebab-case"` ... Enforce the `name` property to kebab case.

### `"kebab-case"`

<eslint-code-block fix :rules="{'vue/name-property-casing': ['error', 'kebab-case']}">

```vue
<script>
  /* ✓ GOOD */
  export default {
    name: 'my-component'
  }
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/name-property-casing': ['error', 'kebab-case']}">

```vue
<script>
  /* ✗ BAD */
  export default {
    name: 'MyComponent'
  }
</script>
```

</eslint-code-block>

## :books: Further reading

- [Style guide - Component name casing in JS/JSX](https://vuejs.org/v2/style-guide/#Component-name-casing-in-JS-JSX-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/name-property-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/name-property-casing.js)
