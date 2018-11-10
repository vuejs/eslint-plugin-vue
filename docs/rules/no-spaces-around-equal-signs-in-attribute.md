# disallow spaces around equal signs in attribute (vue/no-spaces-around-equal-signs-in-attribute)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule disallow spaces around equal signs in attribute.

HTML5 allows spaces around equal signs. But space-less is easier to read, and groups entities better together.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<div class = "item">
```

:+1: Examples of **correct** code for this rule:

```html
<div class="item">
```

## Further Reading

* [HTML5 Style Guide - W3Schools *Spaces and Equal Signs*](https://www.w3schools.com/html/html5_syntax.asp)