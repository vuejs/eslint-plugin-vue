---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-inline-template
description: disallow using deprecated `inline-template` attribute (in Vue.js 3.0.0+)
---
# vue/no-deprecated-inline-template
> disallow using deprecated `inline-template` attribute (in Vue.js 3.0.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.

## :book: Rule Details

This rule reports deprecated `inline-template` attributes (removed in Vue.js v3.0.0+)

<eslint-code-block :rules="{'vue/no-deprecated-inline-template': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-comnponent />

  <!-- ✗ BAD -->
  <my-component inline-template>
    <div>
      <p>These are compiled as the component's own template.</p>
      <p>Not parent's transclusion content.</p>
    </div>
  </my-component>
</template>
```

</eslint-code-block>

### :wrench: Options

Nothing.

## :books: Further Reading

- [Vue RFCs - 0016-remove-inline-templates](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0016-remove-inline-templates.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-inline-template.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-inline-template.js)
