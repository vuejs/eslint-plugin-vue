# Define the number of attributes allows per line (max-attributes-per-line)

Limits the maximum number of attributes/properties per line to improve readability.


## Rule Details

This rule aims to enforce a number of attributes per line in templates.
It checks all the elements in a template and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

There is a configurable number of attributes that are acceptable in one-line case (default 3), as well as how many attributes are acceptable per line in multi-line case (default 1).

Examples of **incorrect** code for this rule:

```js
<component lorem="1" ipsum="2" dolor="3" sit="4">
</component>

<component
  lorem="1" ipsum="2"
  dolor="3"
  sit="4"
>
</component>
```

Examples of **correct** code for this rule:

```js
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

### Options

```
{
  "vue/max-attributes-per-line": ["error", {
    "firstline": 1,
    "singleline": 2,
    "multiline": 1
  }]
}
```

### `firstline`
For multi-line declarations, defines how many attributes are acceptable to be put in the first line. (Default 0)

Example of **incorrect** code for this setting:
```js
// ["error", { "firstline": 1, "singleline": 2, "multiline": 1}]
<component
  foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

Example of **correct** code for this setting:
```js
// ["error", { "firstline": 0, "singleline": 3, "multiline": 1}]
<component
  foo="John"
  bar="Smith"
  foobar={5555555}
  >
</component>;
```


### `singleline`
Number of maximum attributes per line when the opening tag is in a single line.

Example of **incorrect** code for this setting:
```js
// ["error", { "firstline": 1, "singleline": 2, "multiline": 1}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```

Example of **correct** code for this setting:
```js
// ["error", { "firstline": 1, "singleline": 3, "multiline": 1}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```


### `multiline`
Number of maximum attributes per line when a tag is in multiple lines.

Example of **incorrect** code for this setting:
```js
// ["error", { "firstline": 1, "singleline": 2, "multiline": 1}]
<component foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

Example of **correct** code for this setting:
```js
// ["error", { "firstline": 0, "singleline": 3, "multiline": 1}]
<component
  foo="John"
  bar="Smith"
  foobar={5555555}
  >
</component>;
```

## When Not To Use It

If you do not want to check the number of attributes declared per line you can disable this rule.

