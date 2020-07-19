---
pageClass: rule-details
sidebarDepth: 0
title: vue/component-definition-name-casing
description: enforce specific casing for component definition name
---
# vue/component-definition-name-casing
> enforce specific casing for component definition name

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Define a style for component definition name casing for consistency purposes.

## :book: Rule Details

This rule aims to warn the component definition names other than the configured casing.

## :wrench: Options

Default casing is set to `PascalCase`.

```json
{
  "vue/component-definition-name-casing": ["error", "PascalCase" | "kebab-case"]
}
```

- `"PascalCase"` (default) ... enforce component definition names to pascal case.
- `"kebab-case"` ... enforce component definition names to kebab case.

### `"PascalCase" (default)

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  name: 'MyComponent'
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error']}">

```vue
<script>
export default {
  /* ✗ BAD */
  name: 'my-component'
}
</script>
```

</eslint-code-block>

<eslint-code-block fix language="javascript" filename="src/MyComponent.js" :rules="{'vue/component-definition-name-casing': ['error']}">

```js
/* ✓ GOOD */
Vue.component('MyComponent', {
  
})

/* ✗ BAD */
Vue.component('my-component', {
  
})
```

</eslint-code-block>

### `"kebab-case"

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error', 'kebab-case']}">

```vue
<script>
export default {
  /* ✓ GOOD */
  name: 'my-component'
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/component-definition-name-casing': ['error', 'kebab-case']}">

```vue
<script>
export default {
  /* ✗ BAD */
  name: 'MyComponent'
}
</script>
```

</eslint-code-block>

<eslint-code-block fix language="javascript" filename="src/MyComponent.js" :rules="{'vue/component-definition-name-casing': ['error', 'kebab-case']}">

```js
/* ✓ GOOD */
Vue.component('my-component', {
  
})

/* ✗ BAD */
Vue.component('MyComponent', {
  
})
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Component name casing in JS/JSX](https://v3.vuejs.org/style-guide/#component-name-casing-in-js-jsx-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/component-definition-name-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/component-definition-name-casing.js)
