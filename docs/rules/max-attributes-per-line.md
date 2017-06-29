# Define the number of attributes allows per line (max-attributes-per-line)

Limits the maximum number of props per line to improve readability


## Rule Details

This rule aims to enforce a number of props per line in templates. It checks all the elements in a template and verifies that the number of props per line does not exceed the defined maximum.
A prop is considered to be in a new line when there is a line break between two props.

The default is one prop per line

Examples of **incorrect** code for this rule:

```js

<component foo="1" bar="3"></component>

<component foo="1" bar="2"
  foobar="3"></component>

```

Examples of **correct** code for this rule:

```js

<component
  foo="1"
  bar="3"
>
</component>

```

### Options

```
{
  "vue/max-attributes-per-line": ["error", {
    "singleline": 2,
    "multiline": 1
  }]
}
```
### `singleline`
Number of maximum number of props when a tag is in a single line.

The following patterns is considered a warning:
```js
// ["error", { "singleline": 2, "multiline": 1}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```

The following pattern is not considered a warning:
```js
// ["error", { "singleline": 3, "multiline": 1}]
<component foo="John" bar="Smith" foobar={5555555}></component>;
```


### `multiline`
Number of maximum number of props when a tag is in a single line.


The following patterns is considered a warning:
```js
// ["error", { "singleline": 2, "multiline": 1}]
<component foo="John" bar="Smith"
  foobar={5555555}>
</component>;
```

The following pattern is not considered a warning:
```js
// ["error", { "singleline": 3, "multiline": 1}]
<component
  foo="John"
  bar="Smith"
  foobar={5555555}
  >
</component>;
```

## When Not To Use It

If you do not want to check the number of props declared per line you can disable this rule.

