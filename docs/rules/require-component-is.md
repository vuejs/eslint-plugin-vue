# Require `v-bind:is` of `<component>` elements (require-component-is)

> You can use the same mount point and dynamically switch between multiple components using the reserved `<component>` element and dynamically bind to its `is` attribute:
>
> https://vuejs.org/v2/guide/components.html#Dynamic-Components

## :book: Rule Details

This rule reports the `<component>` elements which do not have `v-bind:is` attributes.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <component></component>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <component :is="type"></component>
</template>
```

## :wrench: Options

Nothing.
