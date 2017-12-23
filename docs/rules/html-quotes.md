# enforce quotes style of HTML attributes (html-quotes)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

You can choose quotes of HTML attributes from:

- Double quotes: `<div class="foo">`
- Single quotes: `<div class='foo'>`
- No quotes: `<div class=foo>`

This rule enforces the quotes style of HTML attributes.

## :book: Rule Details

This rule reports the quotes of attributes if it is different to configured quotes.

:-1: Examples of **incorrect** code for this rule:

```html
<img src='./logo.png'>
<img src=./logo.png>
```

:+1: Examples of **correct** code for this rule:

```html
<img src="./logo.png">
```

:-1: Examples of **incorrect** code for this rule with `"single"` option:

```html
<img src="./logo.png">
<img src=./logo.png>
```

:+1: Examples of **correct** code for this rule with `"single"` option:

```html
<img src='./logo.png'>
```

## :wrench: Options

- `"double"` (default) ... requires double quotes.
- `"single"` ... requires single quotes.
