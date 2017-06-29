# Define the number of attributes allows per line (max-attributes-per-line)

Limits the maximum number of attributes/properties per line to improve readability.


## Rule Details

This rule aims to enforce a number of attributes per line in templates. It checks all the elements in a template and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

There is predefined number of attributes that are acceptable in one-line case, as well as how many attributes are acceptable per line in multi-line case.

The default is one attribute per line for multiline and three attributes per line in singleline.

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
For muliline declarations, defines if it accepts an attribute in the first line.

The following patterns is considered a warning:
```js
// ["error", { "firstline": 1, "singleline": 2, "multiline": 1}]
<component
  foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

The following pattern is not considered a warning:
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

The following patterns is considered a warning:
```js
// ["error", { "firstline": 1, "singleline": 2, "multiline": 1}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```

The following pattern is not considered a warning:
```js
// ["error", { "firstline": 1, "singleline": 3, "multiline": 1}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```


### `multiline`
Number of maximum attributes per line when a tag is in multiple lines.


The following patterns is considered a warning:
```js
// ["error", { "firstline": 1, "singleline": 2, "multiline": 1}]
<component foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

The following pattern is not considered a warning:
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

