# enforce end tag style (html-end-tags)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports:

- presence of and end tag on [Void elements](https://www.w3.org/TR/html51/syntax.html#void-elements)
- absence of both an end tag (e.g. `</div>`) and a self-closing opening tag (e.g. `<div/>`) on other elements

:-1: Examples of **incorrect** code for this rule:

```html
<div>
<p>
<p>
<input></input>
<br></br>
```

:+1: Examples of **correct** code for this rule:

```html
<div></div>
<p></p>
<p></p>
<input>
<br>
```

## :wrench: Options

Nothing.
