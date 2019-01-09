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

You can include the AST created by [vue-eslint-parser] in the selector.
To know more about certain nodes in produced AST, please go [vue-eslint-parser - AST docs].

### `"VElement > VExpressionContainer CallExpression"`

Forbids call expressions inside mustache interpolation.

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
- [ESTree]
- [vue-eslint-parser]

[no-restricted-syntax]: https://eslint.org/docs/rules/no-restricted-syntax
[ESTree]: https://github.com/estree/estree
[vue-eslint-parser]: https://github.com/mysticatea/vue-eslint-parser
[vue-eslint-parser - AST docs]: https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-syntax.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-syntax.js)
