# enforce `v-bind` directive style (vue/v-bind-style)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule enforces `v-bind` directive style which you should use shorthand or long form.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<div v-bind:foo="bar"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div :foo="bar"/>
```

:-1: Examples of **incorrect** code for this rule with `"longform"` option:

```html
<div :foo="bar"/>
```

:+1: Examples of **correct** code for this rule with `"longform"` option:

```html
<div v-bind:foo="bar"/>
```

## :wrench: Options

- `"shorthand"` (default) ... requires using shorthand.
- `"longform"` ... requires using long form.

## Related links

- [Style guide - Directive shorthands](https://vuejs.org/v2/style-guide/#Directive-shorthands-strongly-recommended)
