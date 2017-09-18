# enforce the maximum number of attributes per line (max-attributes-per-line)

Limits the maximum number of attributes/properties per line to improve readability.


## :book: Rule Details

This rule aims to enforce a number of attributes per line in templates.
It checks all the elements in a template and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

There is a configurable number of attributes that are acceptable in one-line case (default 3), as well as how many attributes are acceptable per line in multi-line case (default 1).

:-1: Examples of **incorrect** code for this rule:

```html
<component lorem="1" ipsum="2" dolor="3" sit="4">
</component>

<component
  lorem="1" ipsum="2"
  dolor="3"
  sit="4"
>
</component>
```

:+1: Examples of **correct** code for this rule:

```html
<component lorem="1" ipsum="2" dolor="3">
</component>

<component
  lorem="1"
  ipsum="2"
  dolor="3"
  sit="4"
>
</component>

```

### :wrench:  Options

```
{
  "vue/max-attributes-per-line": [{
    "singleline": 3,
    "multiline": {
      max: 1,
      allowFirstLine: false
    }
  }]
}
```

#### `allowFirstLine`
For multi-line declarations, defines if allows attributes to be put in the first line. (Default false)

:-1: Example of **incorrect** code for this setting:
```html
// [{ "multiline": { "allowFirstLine": false }}]
<component foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

:+1: Example of **correct** code for this setting:
```html
// [{ "multiline": { "allowFirstLine": false }}]
<component
  foo="John"
  bar="Smith"
  foobar={5555555}
  >
</component>;
```


#### `singleline`
Number of maximum attributes per line when the opening tag is in a single line. (Default is 3)

:-1: Example of **incorrect** code for this setting:
```html
// [{"singleline": 2,}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```

:+1: Example of **correct** code for this setting:
```html
// [{"singleline": 3,}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```


#### `multiline`
Number of maximum attributes per line when a tag is in multiple lines. (Default is 1)

:-1: Example of **incorrect** code for this setting:
```html
// [{"multiline": 1}]
<component foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

:+1: Example of **correct** code for this setting:
```html
// [{"multiline": 1}]
<component
  foo="John"
  bar="Smith"
  foobar={5555555}
  >
</component>;
```

## When Not To Use It

If you do not want to check the number of attributes declared per line you can disable this rule.

