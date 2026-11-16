---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-multiple-template-root
description: disallow adding multiple root nodes to the template
since: v7.0.0
---

# vue/no-multiple-template-root

> disallow adding multiple root nodes to the template

## :book: Rule Details

This rule checks whether the template contains a single root element.
Vue.js 3 supports multiple root nodes, but fallthrough attributes are then no longer applied automatically (see [Attribute Inheritance on Multiple Root Nodes](https://vuejs.org/guide/components/attrs.html#attribute-inheritance-on-multiple-root-nodes)).
Enable this rule if you want every component to keep a single root element.

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- The root is text -->
<template>Lorem ipsum</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- There are multiple root elements -->
<template>
  <div>hello</div>
  <div>hello</div>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- The root element has `v-for` directives -->
<template>
  <div v-for="item in items" />
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error']}">

```vue
<!-- The root element is `<template>` or `<slot>` -->
<template>
  <slot />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-multiple-template-root": ["error", {
    "disallowComments": false
  }]
}
```

- "disallowComments" (`boolean`) Enables there should not be any comments in the template root. Default is `false`.

### "disallowComments": true

<eslint-code-block :rules="{'vue/no-multiple-template-root': ['error', {disallowComments: true}]}">

```vue
/* ✗ BAD */
<template>
  <!-- root comment -->
  <div>
    vue eslint plugin
  </div>
  <!-- root comment -->
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-multiple-template-root.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-multiple-template-root.test.ts)
