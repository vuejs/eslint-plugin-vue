---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unsupported-features
description: disallow unsupported Vue.js syntax on the specified version
---
# vue/no-unsupported-features
> disallow unsupported Vue.js syntax on the specified version

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports unsupported Vue.js syntax on the specified version.

## :wrench: Options

```json
{
  "vue/no-unsupported-features": ["error", {
    "version": "^2.6.0",
    "ignores": []
  }]
}
```

- `version` ... The `version` option accepts [the valid version range of `node-semver`](https://github.com/npm/node-semver#range-grammar). Set the version of Vue.js you are using. This option is required.
- `ignores` ... You can use this `ignores` option to ignore the given features.
The `"ignores"` option accepts an array of the following strings.
  - Vue.js 2.6.0+
    - `"dynamic-directive-arguments"` ... [dynamic directive arguments](https://vuejs.org/v2/guide/syntax.html#Dynamic-Arguments).
    - `"v-slot"` ... [v-slot](https://vuejs.org/v2/api/#v-slot) directive.
  - Vue.js 2.5.0+
    - `"slot-scope-attribute"` ... [slot-scope](https://vuejs.org/v2/api/#slot-scope-deprecated) attributes.
  - Vue.js `">=2.6.0-beta.1 <=2.6.0-beta.3"` or 2.6 custom build
    - `"v-bind-prop-modifier-shorthand"` ... [v-bind](https://vuejs.org/v2/api/#v-bind) with `.prop` modifier shorthand.

### `{"version": "^2.5.0"}`

<eslint-code-block fix :rules="{'vue/no-unsupported-features': ['error', {'version': '^2.5.0'}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <CustomComponent :foo="val" />
  <ListComponent>
    <template slot="name" slot-scope="props">
      {{ props.title }}
    </template>
  </ListComponent>

  <!-- ✗ BAD -->
  <!-- dynamic directive arguments -->
  <CustomComponent :[foo]="val" />
  <ListComponent>
    <!-- v-slot -->
    <template v-slot:name="props">
      {{ props.title }}
    </template>
    <template #name="props">
      {{ props.title }}
    </template>
  </ListComponent>
</template>
```

</eslint-code-block>

## :books: Further reading

- [Guide - Dynamic Arguments](https://vuejs.org/v2/guide/syntax.html#Dynamic-Arguments)
- [API - v-slot](https://vuejs.org/v2/api/#v-slot)
- [API - slot-scope](https://vuejs.org/v2/api/#slot-scope-deprecated)
- [Vue RFCs - 0001-new-slot-syntax](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md)
- [Vue RFCs - 0002-slot-syntax-shorthand](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0002-slot-syntax-shorthand.md)
- [Vue RFCs - 0003-dynamic-directive-arguments](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0003-dynamic-directive-arguments.md)
- [Vue RFCs - v-bind .prop shorthand proposal](https://github.com/vuejs/rfcs/pull/18)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unsupported-features.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unsupported-features.js)
