# enforce specific casing for the component naming style in template (vue/html-element-name-casing)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

Define a style for the component name in template casing for consistency purposes.

## :book: Rule Details

:+1: Examples of **correct** code for `kebab-case`:

```html
<template>
  <the-component />
</template>
```

:-1: Examples of **incorrect** code for `kebab-case`:

```html
<template>
  <TheComponent />
  <theComponent />
  <The-component />
</template>
```

:+1: Examples of **correct** code for `PascalCase`:

```html
<template>
  <TheComponent />
</template>
```

:-1: Examples of **incorrect** code for `PascalCase`:

```html
<template>
  <the-component />
  <theComponent />
  <Thecomponent />
  <The-component />
</template>
```

## :wrench: Options

Default casing is set to `kebab-case`.

```
"vue/html-element-name-casing": ["error", "kebab-case|PascalCase"]
```

