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
  - Vue.js 3.0.0+
    - `"v-model-argument"` ... [argument on `v-model`][Vue RFCs - 0005-replace-v-bind-sync-with-v-model-argument]
    - `"v-model-custom-modifiers"` ... [custom modifiers on `v-model`][Vue RFCs - 0011-v-model-api-change]
    - `"v-is"` ... [v-is](https://v3.vuejs.org/api/directives.html#v-is) directive.
  - Vue.js 2.6.0+
    - `"dynamic-directive-arguments"` ... [dynamic directive arguments](https://v3.vuejs.org/guide/template-syntax.html#dynamic-arguments).
    - `"v-slot"` ... [v-slot](https://v3.vuejs.org/api/directives.html#v-slot) directive.
  - Vue.js 2.5.0+
    - `"slot-scope-attribute"` ... [slot-scope](https://vuejs.org/v2/api/#slot-scope-deprecated) attributes.
  - Vue.js `">=2.6.0-beta.1 <=2.6.0-beta.3"` or 2.6 custom build
    - `"v-bind-prop-modifier-shorthand"` ... `v-bind` with `.prop` modifier shorthand.

### `{"version": "^2.6.0"}`

<eslint-code-block fix :rules="{'vue/no-unsupported-features': ['error', {'version': '^2.6.0'}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyInput v-bind:foo.sync="val" />

  <!-- ✗ BAD -->
  <!-- argument on `v-model` -->
  <MyInput v-model:foo="val" />
  <!-- custom modifiers on `v-model` -->
  <MyComp v-model.foo.bar="text" />
</template>
```

</eslint-code-block>

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

## :books: Further Reading

- [API - v-is](https://v3.vuejs.org/api/directives.html#v-is)
- [Guide - Dynamic Arguments](https://v3.vuejs.org/guide/template-syntax.html#dynamic-arguments)
- [API - v-slot](https://v3.vuejs.org/api/directives.html#v-slot)
- [API (for v2) - slot-scope](https://vuejs.org/v2/api/#slot-scope-deprecated)
- [Vue RFCs - 0001-new-slot-syntax]
- [Vue RFCs - 0002-slot-syntax-shorthand]
- [Vue RFCs - 0003-dynamic-directive-arguments]
- [Vue RFCs - 0005-replace-v-bind-sync-with-v-model-argument]
- [Vue RFCs - 0011-v-model-api-change]
- [Vue RFCs - v-bind .prop shorthand proposal]

[Vue RFCs - 0001-new-slot-syntax]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md
[Vue RFCs - 0002-slot-syntax-shorthand]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0002-slot-syntax-shorthand.md
[Vue RFCs - 0003-dynamic-directive-arguments]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0003-dynamic-directive-arguments.md
[Vue RFCs - 0005-replace-v-bind-sync-with-v-model-argument]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0005-replace-v-bind-sync-with-v-model-argument.md
[Vue RFCs - 0011-v-model-api-change]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0011-v-model-api-change.md

[Vue RFCs - v-bind .prop shorthand proposal]: https://github.com/vuejs/rfcs/pull/18

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unsupported-features.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unsupported-features.js)
