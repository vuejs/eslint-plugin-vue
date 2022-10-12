---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-on-handler-style
description: enforce writing style for handlers in `v-on` directives
---
# vue/v-on-handler-style

> enforce writing style for handlers in `v-on` directives

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce a consistent style in `v-on` event handlers:

```vue
<!-- Method handler: -->
<button v-on:click="handler" />

<!-- Inline handler: -->
<button v-on:click="handler()" />

<!-- Inline function: -->
<button v-on:click="() => handler()" />
```

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler">...</button>
  <button v-on:click="() => handler()">...</button>

  <!-- ✗ BAD -->
  <button v-on:click="handler()">...</button>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/v-on-handler-style": ["error",
    [
      "method",
      "inline-function"
    ],
    {
      "ignoreIncludesComment": false
    }
  ]
}
```

- First option ... An array of names of allowed styles. Default is `["method", "inline-function"]`.
  - `"method"` ... Allow handlers by method binding. e.g. `v-on:click="handler"`
  - `"inline"` ... Allow inline handlers. e.g. `v-on:click="handler()"`  
                  Even if this is not specified, writing styles that cannot be converted to other allowed styles are allowed.
  - `"inline-function"` ... Allow inline functions. e.g. `v-on:click="() => handler()"`  
                            Even if this is not specified, writing styles that cannot be converted to other allowed styles are allowed.
- Second option
  - `ignoreIncludesComment` ... If `true`, do not report expressions containing comments. This option takes effect if `"method"` is allowed. Default is `false`.

### `["method"]`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['method']]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler">...</button>

  <!-- ✗ BAD -->
  <button v-on:click="handler()">...</button>
  <button v-on:click="() => handler()">...</button>

  <!-- Ignore -->
  <button v-on:click="handler(foo)">...</button>
  <button v-on:click="() => handler(foo)">...</button>
</template>
```

</eslint-code-block>

### `["inline"]`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['inline']]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler()">...</button>

  <!-- ✗ BAD -->
  <button v-on:click="handler">...</button>
  <button v-on:click="() => handler()">...</button>
  <button v-on:click="(foo) => handler(foo)">...</button>
</template>
```

</eslint-code-block>

### `["inline-function"]`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['inline-function']]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="() => handler()">...</button>

  <!-- ✗ BAD -->
  <button v-on:click="handler">...</button>
  <button v-on:click="handler()">...</button>
</template>
```

</eslint-code-block>

### `["method"], { "ignoreIncludesComment": true }`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['method'], {ignoreIncludesComment: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler">...</button>
  <button v-on:click="handler() /* comment */">...</button>
  <button v-on:click="() => handler() /* comment */">...</button>

  <!-- ✗ BAD -->
  <button v-on:click="handler()">...</button>
  <button v-on:click="() => handler()">...</button>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Guide - Inline Handlers]
- [Guide - Method Handlers]

[Guide - Inline Handlers]: https://vuejs.org/guide/essentials/event-handling.html#inline-handlers
[Guide - Method Handlers]: https://vuejs.org/guide/essentials/event-handling.html#method-handlers

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-on-handler-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-on-handler-style.js)
