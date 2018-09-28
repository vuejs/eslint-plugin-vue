# require or disallow a space before tag's closing brackets (vue/html-closing-bracket-spacing)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule enforces consistent spacing style before closing brackets `>` of tags.

```html
<div class="foo"> or <div class="foo" >
<div class="foo"/> or <div class="foo" />
```

## Rule Details

This rule has options.

```json
{
    "vue/html-closing-bracket-spacing": ["error", {
        "startTag": "always" | "never",
        "endTag": "always" | "never",
        "selfClosingTag": "always" | "never"
    }]
}
```

- `startTag` (`"always" | "never"`) ... Setting for the `>` of start tags (e.g. `<div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `endTag` (`"always" | "never"`) ... Setting for the `>` of end tags (e.g. `</div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `selfClosingTag` (`"always" | "never"`) ... Setting for the `/>` of self-closing tags (e.g. `<div/>`). Default is `"always"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.

Examples of **incorrect** code for this rule:

```html
<!--eslint vue/html-closing-bracket-spacing: "error" -->

<div >
<div foo >
<div foo="bar" >
</div >
<div/>
<div foo/>
<div foo="bar"/>
```

Examples of **correct** code for this rule:

```html
<!--eslint vue/html-closing-bracket-spacing: "error" -->

<div>
<div foo>
<div foo="bar">
</div>
<div />
<div foo />
<div foo="bar" />
```

```html
<!--eslint vue/html-closing-bracket-spacing: ["error", {
    "startTag": "always",
    "endTag": "always",
    "selfClosingTag": "always"
}] -->

<div >
<div foo >
<div foo="bar" >
</div >
<div />
<div foo />
<div foo="bar" />
```

# Related rules

- [vue/no-multi-spaces](./no-multi-spaces.md)
- [vue/html-closing-bracket-newline](./html-closing-bracket-newline.md)
