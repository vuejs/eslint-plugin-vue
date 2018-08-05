# require or disallow a line break before and after html contents (vue/html-content-newline)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a line break (or no line break) before and after html contents.


:-1: Examples of **incorrect** code:

```html
<div
  class="panel"
>content</div>
```

:+1: Examples of **correct** code:

```html
<div class="panel">content</div>

<div class="panel">
  content
</div>

<div
  class="panel"
>
  content
</div>
```


## :wrench: Options

```json
{
    "vue/html-content-newline": ["error", {
        "singleline": "ignore",
        "multiline": "always",
        "ignoreNames": ["pre", "textarea"]
    }]
}
```

- `singleline` ... the configuration for single-line elements. It's a single-line element if startTag, endTag and contents are single-line.
    - `"ignore"` ... Don't enforce line breaks style before and after the contents. This is the default.
    - `"never"` ... disallow line breaks before and after the contents.
    - `"always"` ... require one line break before and after the contents.
- `multiline` ... the configuration for multiline elements. It's a multiline element if startTag, endTag or contents are multiline.
    - `"ignore"` ... Don't enforce line breaks style before and after the contents.
    - `"never"` ... disallow line breaks before and after the contents.
    - `"always"` ... require one line break before and after the contents. This is the default.
- `ignoreNames` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`


:-1: Examples of **incorrect** code:

```html
/*eslint vue/html-content-newline: ["error", { "singleline": "always", "multiline": "never"}] */

<div class="panel">content</div>

<div
  class="panel"
>
  content
</div>
```

:+1: Examples of **correct** code:

```html
/*eslint vue/html-content-newline: ["error", { "singleline": "always", "multiline": "never"}] */

<div class="panel">
  content
</div>

<div
  class="panel"
>content</div>
```

