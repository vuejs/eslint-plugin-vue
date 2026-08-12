---
pageClass: rule-details
sidebarDepth: 0
title: vue/simple-expressions-in-templates
description: disallow complex template expressions
---

# vue/simple-expressions-in-templates

> disallow complex template expressions

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule disallows complex template expressions, which are expressions containing more than one function call. As per the [Vue Style Guide](https://vuejs.org/style-guide/rules-strongly-recommended.html#simple-expressions-in-templates):

> Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.

<eslint-code-block :rules="{'vue/simple-expressions-in-templates': ['error']}">

```vue
<template>
  {{
    fullName
      .split(' ')
      .map((word) => {
        return word[0].toUpperCase() + word.slice(1)
      })
      .join(' ')
  }}
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.
