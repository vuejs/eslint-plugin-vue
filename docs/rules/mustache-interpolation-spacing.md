# enforce unified spacing in mustache interpolations (mustache-interpolation-spacing)

- :white_check_mark: The `"extends": "plugin:vue/recommended"` property in a configuration file enables this rule.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce unified spacing in mustache interpolations.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
  <div>{{   text   }}</div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
  <div>{{ text }}</div>
</template>
```

## :wrench: Options

Default spacing is set to `always`

```
'vue/mustache-interpolation-spacing': [2, 'always'|'never']
```

### `"always"` - Expect one space between expression and curly brackets.

:+1: Examples of **correct** code`:

```html
<template>
  <div>{{ text }}</div>
</template>
```

:-1: Examples of **incorrect** code`:

```html
<template>
  <div>{{text}}</div>
</template>
```

### `"never"` - Expect no spaces between expression and curly brackets.

:+1: Examples of **correct** code`:

```html
<template>
  <div>{{text}}</div>
</template>
```

:-1: Examples of **incorrect** code`:

```html
<template>
  <div>{{ text }}</div>
</template>
```
