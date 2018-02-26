# require or disallow a line break before tag's closing brackets (vue/html-closing-bracket-newline)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

People have own preference about the location of closing brackets.
This rule enforces a line break (or no line break) before tag's closing brackets.

```html
<div
    id="foo"
    class="bar"> <!-- On the same line with the last attribute. -->
</div>

<div
    id="foo"
    class="bar"
> <!-- On the next line. -->
</div>
```

## Rule Details

```json
{
    "html-closing-bracket-newline": ["error", {
        "singleline": "never",
        "multiline": "never"
    }]
}
```

- `singleline` ... the configuration for single-line elements. It's a single-line element if the element does not have attributes or the last attribute is on the same line as the opening bracket.
    - `"never"` ... disallow line breaks before the closing bracket. This is the default.
    - `"always"` ... require one line break before the closing bracket.
- `multiline` ... the configuration for multiline elements. It's a multiline element if the last attribute is not on the same line of the opening bracket.
    - `"never"` ... disallow line breaks before the closing bracket. This is the default.
    - `"always"` ... require one line break before the closing bracket.

Plus, you can use [`vue/html-indent`](./html-indent.md) rule to enforce indent-level of the closing brackets.

:-1: Examples of **incorrect** code for this rule:

```html
/*eslint html-closing-bracket-newline: "error"*/

<div id="foo" class="bar"
>
<div
    id="foo"
    class="bar"
>
<div
    id="foo"
    class="bar"
    >
```

:+1: Examples of **correct** code for this rule:

```html
/*eslint html-closing-bracket-newline: "error"*/

<div id="foo" class="bar">
<div
    id="foo"
    class="bar">
```

:-1: Examples of **incorrect** code for `{ "multiline": "always" }`:

```html
/*eslint html-closing-bracket-newline: ["error", { multiline: always }]*/

<div id="foo" class="bar"
>
<div
    id="foo"
    class="bar">
```

:+1: Examples of **correct** code for `{ "multiline": "always" }`:

```html
/*eslint html-closing-bracket-newline: ["error", { multiline: always }]*/

<div id="foo" class="bar">
<div
    id="foo"
    class="bar"
>
<div
    id="foo"
    class="bar"
    >
```
