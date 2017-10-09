# enforce end tag style (html-end-tags)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

This rule enforce the way of end tags.

- [Void elements] disallow end tags.
- Other elements require end tags.

## :book: Rule Details

This rule reports the following elements:

- [Void elements] which have end tags.
- Other elements which do not have end tags and are not self-closing.

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

[Void elements]: https://www.w3.org/TR/html51/syntax.html#void-elements

## TODO: `<br></br>`

`parse5` does not recognize the illegal end tags of void elements.
