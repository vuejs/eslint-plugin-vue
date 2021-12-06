---
pageClass: rule-details
sidebarDepth: 0
title: vue/component-options-name-casing
description: enforce the casing of component name in `components` options
since: v8.2.0
---
# vue/component-options-name-casing

> enforce the casing of component name in `components` options

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

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

Please note that if you use kebab case in `components` options,
you can **only** use kebab case in template;
and if you use camel case in `components` options,
you **can't** use pascal case in template.

For demonstration, the code example is invalid:

```vue
<template>
  <div>
    <!-- All are invalid. DO NOT use like these. -->
    <KebabCase />
    <kebabCase />
    <CamelCase />
  </div>
</template>

<script>
export default {
  components: {
    camelCase: MyComponent,
    'kebab-case': MyComponent
  }
}
</script>
```

### `"PascalCase"` (default)

<eslint-code-block fix :rules="{'vue/component-options-name-casing': ['error']}">

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

<eslint-code-block fix :rules="{'vue/component-options-name-casing': ['error']}">

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

<eslint-code-block fix :rules="{'vue/component-options-name-casing': ['error', 'kebab-case']}">

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

<eslint-code-block fix :rules="{'vue/component-options-name-casing': ['error', 'kebab-case']}">

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

<eslint-code-block fix :rules="{'vue/component-options-name-casing': ['error', 'camelCase']}">

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

<eslint-code-block fix :rules="{'vue/component-options-name-casing': ['error', 'camelCase']}">

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

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v8.2.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/component-options-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/component-options-name-casing.js)
