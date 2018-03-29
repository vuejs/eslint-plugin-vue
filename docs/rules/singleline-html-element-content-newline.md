# require a line break before and after the contents of a singleline element (vue/singleline-html-element-content-newline)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a line break before and after the contents of a singleline element.


:-1: Examples of **incorrect** code:

```html
<div attr>content</div>

<tr attr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>

<div attr><!-- comment --></div>
```

:+1: Examples of **correct** code:

```html
<div attr>
  content
</div>

<tr attr>
  <td>
    {{ data1 }}
  </td>
  <td>
    {{ data2 }}
  </td>
</tr>

<div attr>
  <!-- comment -->
</div>
```

## :wrench: Options

```json
{
  "vue/singleline-html-element-content-newline": ["error", {
    "strict": false,
    "ignoreNames": ["pre", "textarea"]
  }]
}
```

- `strict` ... if false, if there are no attributes on the element, this rule allows having contents in one line.  
    if true, even if there are no attributes on the element, this rule disallows having contents in one line.  
    default `false`
- `ignoreNames` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`

:-1: Examples of **incorrect** code for `{strict: true}`:

```html
/* eslint vue/singleline-html-element-content-newline: ["error", { "strict": true}] */

<div>content</div>

<tr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>

<div><!-- comment --></div>
```

:+1: Examples of **correct** code for `{strict: false}` (default):

```html
/* eslint vue/singleline-html-element-content-newline: ["error", { "strict": false}] */

<div>content</div>

<tr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>

<div><!-- comment --></div>
```

:-1: Examples of **incorrect** code for `{strict: false}` (default):

```html
/* eslint vue/singleline-html-element-content-newline: ["error", { "strict": false}] */

<div attr>content</div>

<tr attr><td>{{ data1 }}</td><td>{{ data2 }}</td></tr>

<div attr><!-- comment --></div>
```

:+1: Examples of **correct** code for `ignoreNames`:

```html
/* eslint vue/singleline-html-element-content-newline: ["error", { "ignoreNames": ["VueComponent", "pre", "textarea"]}] */

<VueComponent>content</VueComponent>

<VueComponent attr><span>content</span></VueComponent>
```
