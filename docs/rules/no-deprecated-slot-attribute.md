---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-deprecated-slot-attribute
description: disallow deprecated `slot` attribute (in Vue.js 2.6.0+)
since: v6.1.0
---

# vue/no-deprecated-slot-attribute

> disallow deprecated `slot` attribute (in Vue.js 2.6.0+)

- :gear: This rule is included in all of `"plugin:vue/vue3-essential"`, `*.configs["flat/essential"]`, `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue3-recommended"` and `*.configs["flat/recommended"]`.
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

## :wrench: Options

```json
{
  "vue/no-deprecated-slot-attribute": ["error", {
    "ignore": ["my-component"]
  }]
}
```

- `"ignore"` (`string[]`) An array of tags that ignore this rules. This option will check both kebab-case and PascalCase versions of the given tag names. Default is empty.

### `"ignore": ["my-component"]`

<eslint-code-block fix :rules="{'vue/no-dupe-keys': ['error', {ignore: ['my-component']}]}">

```vue
<template>
  <ListComponent>
    <!-- ✓ GOOD -->
    <template v-slot:name>
      {{ props.title }}
    </template>
  </ListComponent>

  <ListComponent>
    <!-- ✓ GOOD -->
    <my-component slot="name">
      {{ props.title }}
    </my-component>
  </ListComponent>

  <ListComponent>
    <!-- ✗ BAD -->
    <other-component slot="name">
      {{ props.title }}
    </other-component>
  </ListComponent>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [API - slot](https://v2.vuejs.org/v2/api/#slot-deprecated)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v6.1.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-deprecated-slot-attribute.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-deprecated-slot-attribute.js)
