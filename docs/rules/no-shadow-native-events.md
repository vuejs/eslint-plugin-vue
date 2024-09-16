---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-shadow-native-events
description: disallow `emits` which would shadow native html events
---
# vue/no-shadow-native-events

> disallow `emits` which would shadow native HTML events

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>

## :book: Rule Details

This rule reports emits that shadow native HTML events. (The `emits` option is a new in Vue.js 3.0.0+)

Using native event names for emits can lead to incorrect assumptions about an emit and cause confusion. This is caused by Vue emits behaving differently from native events. E.g. :

- The payload of an emit can be chosen arbitrarily
- Vue emits do not bubble, while most native events do
- [Event modifiers](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers) only work on HTML events or when the original event is re-emitted as emit payload.
- When the native event is remitted the `event.target` might not match the actual event-listeners location.

The rule is mostly aimed at developers of component libraries.

<eslint-code-block :rules="{'vue/no-shadow-native-events': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <button @click="$emit('close')">Close</button>
  <!-- ✗ BAD -->
  <button @click="$emit('click')">Close</button>
</template>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related Rules

- [vue/no-unused-emit-declarations](./no-unused-emit-declarations.md)
- [vue/require-explicit-emits](./require-explicit-emits.md)

## :books: Further Reading

- [Components In-Depth - Events  / Component Events](https://vuejs.org/guide/components/events.html#event-arguments)
- [Vue RFCs - 0030-emits-option](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)
