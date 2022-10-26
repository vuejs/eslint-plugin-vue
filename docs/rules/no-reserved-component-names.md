---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-reserved-component-names
description: disallow the use of reserved names in component definitions
since: v6.1.0
---
# vue/no-reserved-component-names

> disallow the use of reserved names in component definitions

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/essential"`, `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.

## :book: Rule Details

This rule prevents name collisions between Vue components and standard HTML elements and built-in components.

<eslint-code-block :rules="{'vue/no-reserved-component-names': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'div'
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-reserved-component-names": ["error", {
    "disallowVueBuiltInComponents": false,
    "disallowVue3BuiltInComponents": false
  }]
}
```

- `disallowVueBuiltInComponents` (`boolean`) ... If `true`, disallow Vue.js 2.x built-in component names. Default is `false`.
- `disallowVue3BuiltInComponents` (`boolean`) ... If `true`, disallow Vue.js 3.x built-in component names. Default is `false`.

### `"disallowVueBuiltInComponents": true`

<eslint-code-block :rules="{'vue/no-reserved-component-names': ['error', {disallowVueBuiltInComponents: true}]}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'transition-group'
}
</script>
```

</eslint-code-block>

### `"disallowVue3BuiltInComponents": true`

<eslint-code-block :rules="{'vue/no-reserved-component-names': ['error', {disallowVue3BuiltInComponents: true}]}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'teleport'
}
</script>
```

</eslint-code-block>

## :books: Further Reading

- [List of html elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [List of SVG elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)
- [Kebab case elements](https://stackoverflow.com/questions/22545621/do-custom-elements-require-a-dash-in-their-name/22545622#22545622)
- [Valid custom element name](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)
- [API - Built-In Components](https://vuejs.org/api/built-in-components.html)
- [API (for v2) - Built-In Components](https://v2.vuejs.org/v2/api/index.html#Built-In-Components)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v6.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-reserved-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-reserved-component-names.js)
