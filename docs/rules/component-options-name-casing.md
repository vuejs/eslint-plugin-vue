---
pageClass: rule-details
sidebarDepth: 0
title: vue/component-options-name-casing
description: enforce the casing of component name in `components` options
---
# vue/component-options-name-casing

> enforce the casing of component name in `components` options

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce casing of the component names in `components` options.

## :wrench: Options

```json
{
  "vue/component-options-name-casing": ["error", "PascalCase" | "kebab-case" | "camelCase"]
}
```

This rule has an option which can be one of these values:

- `"PascalCase"` (default) ... enforce component names to pascal case.
- `"kebab-case"` ... enforce component names to kebab case.
- `"camelCase"` ... enforce component names to camel case.

### `"PascalCase"` (default)

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  components: {
    AppHeader,
    AppSidebar
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error']}">

```vue
<script>
export default {
  /* ✗ BAD */
  components: {
    appHeader,
    'app-sidebar': AppSidebar
  }
}
</script>
```

</eslint-code-block>

### `"kebab-case"`

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error', 'kebab-case']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  components: {
    'app-header': AppHeader,
    'app-sidebar': appSidebar
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error', 'kebab-case']}">

```vue
<script>
export default {
  /* ✗ BAD */
  components: {
    AppHeader,
    appSidebar
  }
}
</script>
```

</eslint-code-block>

### `"camelCase"`

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error', 'camelCase']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  components: {
    appHeader,
    appSidebar
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error', 'camelCase']}">

```vue
<script>
export default {
  /* ✗ BAD */
  components: {
    AppHeader,
    'app-sidebar': appSidebar
  }
}
</script>
```

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/component-options-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/component-options-name-casing.js)
