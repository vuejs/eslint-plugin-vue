---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-slot-attribute
description: disallow deprecated `slot` attribute (in Vue.js 2.6.0+)
---
# vue/no-deprecated-slot-attribute
> disallow deprecated `slot` attribute (in Vue.js 2.6.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `"plugin:vue/vue3-strongly-recommended"` and `"plugin:vue/vue3-recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports deprecated `slot` attribute in Vue.js v2.6.0+.

<eslint-code-block fix :rules="{'vue/no-deprecated-slot-attribute': ['error']}">

```vue
<template>
  <ListComponent>
    <!-- ✓ GOOD -->
    <template v-slot:name>
      {{ props.title }}
    </template>
  </ListComponent>
  <ListComponent>
    <!-- ✗ BAD -->
    <template slot="name">
      {{ props.title }}
    </template>
  </ListComponent>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [API - slot](https://vuejs.org/v2/api/#slot-deprecated)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-slot-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-slot-attribute.js)
