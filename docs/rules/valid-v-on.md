---
pageClass: rule-details
sidebarDepth: 0
title: vue/valid-v-on
description: enforce valid `v-on` directives
---
# vue/valid-v-on
> enforce valid `v-on` directives

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every `v-on` directive is valid.

## :book: Rule Details

This rule reports `v-on` directives in the following cases:

- The directive does not have that event name. E.g. `<div v-on="foo"></div>`
- The directive has invalid modifiers. E.g. `<div v-on:click.bbb="foo"></div>`
- The directive does not have that attribute value and any verb modifiers. E.g. `<div v-on:click></div>`

<eslint-code-block :rules="{'vue/valid-v-on': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div v-on="foo"/>
  <div v-on:click="foo"/>
  <div @click="foo"/>
  <div @click.left="foo"/>
  <div @click.prevent/>
  <div @click.stop/>

  <!-- ✗ BAD -->
  <div v-on/>
  <div v-on:click/>
  <div v-on:click.aaa="foo"/>
  <div @click/>
</template>
```

</eslint-code-block>

::: warning Note
This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.
:::

## :wrench: Options

```json
{
  "vue/valid-v-on": ["error", {
    "modifiers": []
  }]
}
```

This rule has an object option:

`"modifiers"` array of additional allowed modifiers.

### `"modifiers": ["foo"]`

<eslint-code-block :rules="{'vue/valid-v-on': ['error', { modifiers: ['foo']}]}">

```vue
<template>
  <div @click.foo="foo"/>
  <div v-on:click.foo="foo"/>
</template>
```

</eslint-code-block>

## :couple: Related rules

- [no-parsing-error]

[no-parsing-error]: no-parsing-error.md

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/valid-v-on.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/valid-v-on.js)
