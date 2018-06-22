# enforce the tag name of the Vue component and HTML element to be `kebab-case` (vue/html-element-name-kebab-casing)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

This rule enforce the tag name of the Vue component, HTML element, and custom element to be `kebab-case`.
It does not target elements of MathML or SVG.


Do not use this rule if you prefer `PascalCase` to the Vue component name.

## :book: Rule Details

:+1: Examples of **correct** code:

```html
<template>
  <div />
  <vue-component />
  <custome-element />
</template>
```

:-1: Examples of **incorrect** code:

```html
<template>
  <Div />
  <VueComponent />
  <vueComponent />
  <Vuecomponent />
  <Vue-component />
  <CustomeElement />
</template>
```
