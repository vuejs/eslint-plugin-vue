# Enforce valid template root (valid-root-element)

This rule checks whether every template root is valid.

## :book: Rule Details

This rule reports the template root in the following cases:

- The root is nothing. E.g. `<template></template>`.
- The root is text. E.g. `<template>hello</template>`.
- The root is multiple elements. E.g. `<template><div>one</div><div>two</div></template>`.
- The root element has `v-for` directives. E.g. `<template><div v-for="x in list">{{x}}</div></template>`.
- The root element is `<template>` or `<slot>` elements. E.g. `<template><template>hello</template></template>`.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
</template>
```

```html
<template>
    <div>hello</div>
    <div>hello</div>
</template>
```

```html
<template>
    abc
</template>
```

```html
<template>
    <div v-for="x in list"></div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>abc</div>
</template>
```

```html
<template>
    <div v-if="foo"></div>
</template>
```

```html
<template>
    <div v-if="foo">abc</div>
    <div v-else>def</div>
</template>
```

## :wrench: Options

Nothing.
