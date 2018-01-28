# enforce the maximum number of attributes per line (vue/max-attributes-per-line)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

Limits the maximum number of attributes/properties per line to improve readability.


## :book: Rule Details

This rule aims to enforce a number of attributes per line in templates.
It checks all the elements in a template and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

There is a configurable number of attributes that are acceptable in one-line case (default 1), as well as how many attributes are acceptable per line in multi-line case (default 1).

:-1: Examples of **incorrect** code for this rule:

```html
<MyComponent lorem="1" ipsum="2"/>

<MyComponent
  lorem="1" ipsum="2"
/>

<MyComponent
  lorem="1" ipsum="2"
  dolor="3"
/>
```

:+1: Examples of **correct** code for this rule:

```html
<MyComponent lorem="1"/>

<MyComponent
  lorem="1"
  ipsum="2"
/>

<MyComponent
  lorem="1"
  ipsum="2"
  dolor="3"
/>
```

### :wrench:  Options

```json
{
  "vue/max-attributes-per-line": [2, {
    "singleline": 1,
    "multiline": {
      "max": 1,
      "allowFirstLine": false
    }
  }]
}
```

#### `allowFirstLine`

For multi-line declarations, defines if allows attributes to be put in the first line. (Default false)

:-1: Example of **incorrect** code for this setting:

```html
<!-- [{ "multiline": { "allowFirstLine": false }}] -->
<MyComponent foo="John"
  bar="Smith"
/>
```

:+1: Example of **correct** code for this setting:

```html
<!-- [{ "multiline": { "allowFirstLine": false }}] -->
<MyComponent
  foo="John"
  bar="Smith"
/>
```

#### `singleline`

Number of maximum attributes per line when the opening tag is in a single line. (Default is 1)

:-1: Example of **incorrect** code for this setting:
```html
<!-- [{"singleline": 1}] -->
<MyComponent foo="John" bar="Smith"/>
```

:+1: Example of **correct** code for this setting:
```html
<!-- [{"singleline": 1}] -->
<MyComponent foo="John"/>
```

#### `multiline`

Number of maximum attributes per line when a tag is in multiple lines. (Default is 1)

:-1: Example of **incorrect** code for this setting:

```html
<!-- [{"multiline": 1}] -->
<MyComponent
  foo="John" bar="Smith"
/>
```

:+1: Example of **correct** code for this setting:

```html
<!-- [{"multiline": 1}] -->
<MyComponent
  foo="John"
  bar="Smith"
/>
```

## When Not To Use It

If you do not want to check the number of attributes declared per line you can disable this rule.
