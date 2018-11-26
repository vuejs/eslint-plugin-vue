---
pageClass: rule-details
sidebarDepth: 0
title: vue/component-name-in-template-casing
description: enforce specific casing for the component naming style in template
---
# vue/component-name-in-template-casing
> enforce specific casing for the component naming style in template

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Define a style for the component name in template casing for consistency purposes.

## :book: Rule Details

This rule aims to warn the tag names other than the configured casing in Vue.js template.

## :wrench: Options

```json
{
  "vue/component-name-in-template-casing": ["error", "PascalCase" | "kebab-case", { 
    "ignores": []
  }]
}
```

- `"PascalCase"` (default) ... enforce tag names to pascal case. E.g. `<CoolComponent>`. This is consistent with the JSX practice.
- `"kebab-case"` ... enforce tag names to kebab case: E.g. `<cool-component>`. This is consistent with the HTML practice which is case-insensitive originally.
- `ignores` (`string[]`) ... The element names to ignore. Sets the element name to allow. For example, a custom element or a non-Vue component.

### `"PascalCase"`

<eslint-code-block fix :rules="{'vue/component-name-in-template-casing': ['error']}">
```
<template>
  <!-- ✓ GOOD -->
  <TheComponent />
  
  <!-- ✗ BAD -->
  <the-component />
  <theComponent />
  <The-component />
</template>
```
</eslint-code-block>

### `"kebab-case"`

<eslint-code-block fix :rules="{'vue/component-name-in-template-casing': ['error', 'kebab-case']}">
```
<template>
  <!-- ✓ GOOD -->
  <the-component />

  <!-- ✗ BAD -->
  <TheComponent />
  <theComponent />
  <Thecomponent />
  <The-component />
</template>
```
</eslint-code-block>


### `"PascalCase", { ignores: ["custom-element"] }`

<eslint-code-block fix :rules="{'vue/component-name-in-template-casing': ['error', 'PascalCase', {ignores: ['custom-element']}]}">
```
<template>
  <!-- ✓ GOOD -->
  <TheComponent/>
  <custom-element></custom-element>
  
  <!-- ✗ BAD -->
  <magic-element></magic-element>
</template>
```
</eslint-code-block>

## :books: Further reading

- [Style guide - Component name casing in templates](https://vuejs.org/v2/style-guide/#Component-name-casing-in-templates-strongly-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/component-name-in-template-casing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/component-name-in-template-casing.js)
