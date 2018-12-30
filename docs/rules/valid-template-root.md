---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-template-root
description: enforce valid template root
---
# vue/valid-template-root
> enforce valid template root

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- There is no root element -->
<template></template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- The root is text -->
<template>Lorem ipsum</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- There are multiple root elements -->
<template>
  <div>hello</div>
  <div>hello</div>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- The root element has `v-for` directives -->
<template>
  <div v-for="item in items"/>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/valid-template-root': ['error']}">

```vue
<!-- The root element is `<template>` or `<slot>` -->
<template>
  <slot />
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-template-root.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-template-root.js)
