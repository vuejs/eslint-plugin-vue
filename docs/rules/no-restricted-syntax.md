---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-syntax
description: disallow specified syntax
---
# vue/no-restricted-syntax
> disallow specified syntax

This rule is the same rule as core [no-restricted-syntax] rule but it applies to the expressions in `<template>`.


## :wrench: Options

Please see [no-restricted-syntax] for detailed options.

You can include the AST created by `vue-eslint-parser` in the selector.
To know more about certain nodes in produced AST, please go the [vue-eslint-parser AST docs](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md).

### `"VAttribute[directive=true][key.name='on'] > VExpressionContainer > FunctionExpression"`

Forbind function expressions on `v-on`

<eslint-code-block :rules="{'vue/no-restricted-syntax': ['error', 'VAttribute[directive=true][key.name=\'on\'] > VExpressionContainer > FunctionExpression']}">

```vue
<template>
  <!-- ✔ GOOD -->
  <button
    @click="() => onClick()">
    GOOD
  </button>
  <button
    @click="onClick()">
    GOOD
  </button>
  <button
    @click="onClick">
    GOOD
  </button>

  <!-- ✘ BAD -->
  <button
    @click="function() { onClick() }">
    BAD
  </button>
</template>
```

</eslint-code-block>

### `"VElement > VExpressionContainer CallExpression"`

Forbind call expressions on mustache interpolation

<eslint-code-block :rules="{'vue/no-restricted-syntax': ['error', 'VElement > VExpressionContainer CallExpression']}">

```vue
<template>
  <!-- ✔ GOOD -->
  <div> {{ foo }} </div>
  <div> {{ foo.bar }} </div>

  <!-- ✘ BAD -->
  <div> {{ foo() }} </div>
  <div> {{ foo.bar() }} </div>
  <div> {{ foo().bar }} </div>
</template>
```

</eslint-code-block>

## :books: Further reading

- [no-restricted-syntax]

[no-restricted-syntax]: https://eslint.org/docs/rules/no-restricted-syntax

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-syntax.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-syntax.js)
