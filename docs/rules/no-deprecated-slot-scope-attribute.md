---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-slot-scope-attribute
description: disallow deprecated `slot-scope` attribute (in Vue.js 2.6.0+)
---
# vue/no-deprecated-slot-scope-attribute
> disallow deprecated `slot-scope` attribute (in Vue.js 2.6.0+)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports deprecated `slot-scope` attribute in Vue.js v2.6.0+.

<eslint-code-block fix :rules="{'vue/no-deprecated-slot-scope-attribute': ['error']}">

```vue
<template>
  <ListComponent>
    <!-- ✓ GOOD -->
    <template v-slot="props">
      {{ props.title }}
    </template>
  </ListComponent>
  <ListComponent>
    <!-- ✗ BAD -->
    <template slot-scope="props">
      {{ props.title }}
    </template>
  </ListComponent>
</template>
```

</eslint-code-block>

## :books: Further reading

- [API - slot-scope](https://vuejs.org/v2/api/#slot-scope-deprecated)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-slot-scope-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-slot-scope-attribute.js)
