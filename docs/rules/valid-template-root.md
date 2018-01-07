# enforce valid template root (vue/valid-template-root)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

- The root is nothing. E.g. `<template></template>`.
- The root is text. E.g. `<template>hello</template>`.
- The root is multiple elements. E.g. `<template><div>one</div><div>two</div></template>`.
- The root element has `v-for` directives. E.g. `<template><div v-for="x in list">{{x}}</div></template>`.
- The root element is `<template>` or `<slot>` elements. E.g. `<template><template>hello</template></template>`.

:-1: Examples of **incorrect** code for this rule:

:-1: Examples of **incorrect** code for this rule:

```js
template: ''
```

```html
<template>
</template>
```

```js
template: `
  <div>hello</div>
  <div>hello</div>
`
```

```html
<template>
  <div>hello</div>
  <div>hello</div>
</template>
```

```js
template: 'abc'
```

```html
<template>
  abc
</template>
```

```js
template: '<div v-for="item in items"/>'
```

```html
<template>
  <div v-for="item in items"/>
</template>
```

:+1: Examples of **correct** code for this rule:

```js
template: '<div>abc</div>'
```

```html
<template>
  <div>abc</div>
</template>
```

```js
template: '<div v-if="foo">abc</div>'
```

```html
<template>
  <div v-if="foo">abc</div>
</template>
```

```js
template: `
  <div v-if="foo">abc</div>
  <div v-else>def</div>
`
```

```html
<template>
  <div v-if="foo">abc</div>
  <div v-else>def</div>
</template>
```

## :wrench: Options

Nothing.
