# enforce unified spacing in mustache interpolations (vue/mustache-interpolation-spacing)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce unified spacing in mustache interpolations.

:-1: Examples of **incorrect** code for this rule:

```html
<div>{{   text   }}</div>
<div>{{text}}</div>
```

:+1: Examples of **correct** code for this rule:

```html
<div>{{ text }}</div>
```

## :wrench: Options

Default spacing is set to `always`

```
'vue/mustache-interpolation-spacing': [2, 'always'|'never']
```

### `"always"` - Expect one space between expression and curly brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<div>{{   text   }}</div>
<div>{{text}}</div>
```

:+1: Examples of **correct** code for this rule:

```html
<div>{{ text }}</div>
```

### `"never"` - Expect no spaces between expression and curly brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<div>{{ text }}</div>
```

:+1: Examples of **correct** code for this rule:

```html
<div>{{text}}</div>
```
