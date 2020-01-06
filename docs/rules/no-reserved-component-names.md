---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-reserved-component-names
description: disallow the use of reserved names in component definitions
---
# vue/no-reserved-component-names
> disallow the use of reserved names in component definitions

## :book: Rule Details

This rule prevents name collisions between vue components and standard html elements. 

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

Nothing.

## :books: Further reading

- [List of html elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [List of SVG elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)
- [Kebab case elements](https://stackoverflow.com/questions/22545621/do-custom-elements-require-a-dash-in-their-name/22545622#22545622)
- [Valid custom element name](https://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-reserved-component-names.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-reserved-component-names.js)
