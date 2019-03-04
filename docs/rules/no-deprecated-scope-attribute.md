---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-scope-attribute
description: disallow deprecated `scope` attribute (in Vue.js 2.5.0+)
---
# vue/no-deprecated-scope-attribute
> disallow deprecated `scope` attribute (in Vue.js 2.5.0+)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports deprecated `scope` attribute in Vue.js v2.5.0+.

<eslint-code-block fix :rules="{'vue/no-deprecated-scope-attribute': ['error']}">

```vue
<template>
  <ListComponent>
    <!-- ✓ GOOD -->
    <template v-slot:name="props">
      {{ props.title }}
    </template>
    <template slot="name" slot-scope="props">
      {{ props.title }}
    </template>
  </ListComponent>
  <ListComponent>
    <!-- ✗ BAD -->
    <template slot="name" scope="props">
      {{ props.title }}
    </template>
  </ListComponent>
</template>
```

</eslint-code-block>

## :books: Further reading

- [API - scope](https://vuejs.org/v2/api/#scope-removed)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-scope-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-scope-attribute.js)
