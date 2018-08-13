# require a line break before and after the contents of a multiline element (vue/multiline-html-element-content-newline)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a line break before and after the contents of a multiline element.


:-1: Examples of **incorrect** code:

```html
<div>multiline
  content</div>

<div
  attr
>multiline start tag</div>

<tr><td>multiline</td>
  <td>children</td></tr>

<div><!-- multiline
  comment --></div>

<div
></div>
```

:+1: Examples of **correct** code:

```html
<div>
  multiline
  content
</div>

<div
  attr
>
  multiline start tag
</div>

<tr>
  <td>multiline</td>
  <td>children</td>
</tr>

<div>
  <!-- multiline
       comment -->
</div>

<div
>
</div>

<div attr>singleline element</div>
```


## :wrench: Options

```json
{
    "vue/multiline-html-element-content-newline": ["error", {
        "ignores": ["pre", "textarea"]
    }]
}
```

- `ignores` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`


:+1: Examples of **correct** code:

```html
/* eslint vue/multiline-html-element-content-newline: ["error", { "ignores": ["VueComponent", "pre", "textarea"]}] */

<VueComponent>multiline
content</VueComponent>

<VueComponent><span
  class="bold">For example,</span>
Defines the Vue component that accepts preformatted text.</VueComponent>
```
