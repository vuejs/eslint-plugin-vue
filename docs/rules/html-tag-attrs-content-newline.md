# require a line break before and after contents whenever the HTML tag has any attribute (vue/html-tag-attrs-content-newline)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a line break before and after html contents whenever the HTML tag has any attribute.


:-1: Examples of **incorrect** code:

```html
<div
  class="panel"
>content</div>
```

:+1: Examples of **correct** code:

```html
<div>content</div>

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
        "ignoreNames": ["pre", "textarea"]
    }]
}
```

- `ignoreNames` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`


:+1: Examples of **correct** code:

```html
/*eslint vue/html-content-newline: ["error", { "ignoreNames": ["vue-component", "pre", "textarea"]}] */

<VueComponent class="panel">content</VueComponent>

<VueComponent
  class="panel"
>
  content
</VueComponent>
```

