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
  <button v-on:click="handler" />

  <!-- ✗ BAD -->
  <button v-on:click="handler()" />
  <button v-on:click="() => handler()" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/v-on-handler-style": ["error",
    ["method", "inline-function"], // ["method", "inline-function"] | ["method", "inline"] | "inline-function" | "inline"
    {
      "ignoreIncludesComment": false
    }
  ]
}
```

- First option ... Specifies the name of an allowed style. Default is `["method", "inline-function"]`.
  - `["method", "inline-function"]` ... Allow handlers by method binding. e.g. `v-on:click="handler"`. Allow inline functions where method handlers cannot be used. e.g. `v-on:click="() => handler(listItem)"`.
  - `["method", "inline"]` ... Allow handlers by method binding. e.g. `v-on:click="handler"`. Allow inline handlers where method handlers cannot be used. e.g. `v-on:click="handler(listItem)"`.
  - `"inline-function"` ... Allow inline functions. e.g. `v-on:click="() => handler()"`
  - `"inline"` ... Allow inline handlers. e.g. `v-on:click="handler()"`
- Second option
  - `ignoreIncludesComment` ... If `true`, do not report inline handlers or inline functions containing comments, even if the preferred style is `"method"`. Default is `false`.

### `["method", "inline-function"]` (Default)

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['method', 'inline-function']]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler" />
  <template v-for="e in list">
    <button v-on:click="e" />
    <button v-on:click="() => handler(e)" />
  </template>

  <!-- ✗ BAD -->
  <button v-on:click="handler()" />
  <button v-on:click="count++" />
  <button v-on:click="() => handler()" />
  <button v-on:click="() => count++" />
  <button v-on:click="(a, b) => handler(a, b)" />
  <template v-for="e in list">
    <button v-on:click="e()" />
    <button v-on:click="() => e()" />
    <button v-on:click="handler(e)" />
  </template>
</template>
```

</eslint-code-block>

### `["method", "inline"]`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['method', 'inline']]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler" />
  <template v-for="e in list">
    <button v-on:click="e" />
    <button v-on:click="handler(e)" />
  </template>

  <!-- ✗ BAD -->
  <button v-on:click="handler()" />
  <button v-on:click="count++" />
  <button v-on:click="() => handler()" />
  <button v-on:click="() => count++" />
  <button v-on:click="(a, b) => handler(a, b)" />
  <template v-for="e in list">
    <button v-on:click="e()" />
    <button v-on:click="() => e()" />
    <button v-on:click="() => handler(e)" />
  </template>
</template>
```

</eslint-code-block>

### `"inline-function"`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', 'inline-function']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="() => handler()" />
  <button v-on:click="() => count++" />

  <!-- ✗ BAD -->
  <button v-on:click="handler" />
  <button v-on:click="handler()" />
  <button v-on:click="handler($event)" />
  <button v-on:click="count++" />
</template>
```

</eslint-code-block>

### `"inline"`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', 'inline']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler()" />
  <button v-on:click="handler($event)" />
  <button v-on:click="count++" />

  <!-- ✗ BAD -->
  <button v-on:click="handler" />
  <button v-on:click="() => handler()" />
  <button v-on:click="(foo) => handler(foo)" />
  <button v-on:click="(foo, bar) => handler(foo, bar)" />
  <button v-on:click="() => count++" />
</template>
```

</eslint-code-block>

### `["method", "inline-function"], { "ignoreIncludesComment": true }`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['method', 'inline-function'], {ignoreIncludesComment: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler" />
  <button v-on:click="() => handler() /* comment */" />

  <!-- ✗ BAD -->
  <button v-on:click="handler()" />
  <button v-on:click="() => handler()" />
  <button v-on:click="handler() /* comment */" />
</template>
```

</eslint-code-block>

### `["method", "inline"], { "ignoreIncludesComment": true }`

<eslint-code-block fix :rules="{'vue/v-on-handler-style': ['error', ['method', 'inline'], {ignoreIncludesComment: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button v-on:click="handler" />
  <button v-on:click="handler() /* comment */" />

  <!-- ✗ BAD -->
  <button v-on:click="handler()" />
  <button v-on:click="() => handler()" />
  <button v-on:click="() => handler() /* comment */" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/v-on-style](./v-on-style.md)
- [vue/v-on-event-hyphenation](./v-on-event-hyphenation.md)

## :books: Further Reading

- [Guide - Inline Handlers]
- [Guide - Method Handlers]

[Guide - Inline Handlers]: https://vuejs.org/guide/essentials/event-handling.html#inline-handlers
[Guide - Method Handlers]: https://vuejs.org/guide/essentials/event-handling.html#method-handlers

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-on-handler-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-on-handler-style.js)
