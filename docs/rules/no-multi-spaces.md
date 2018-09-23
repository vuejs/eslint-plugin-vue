# disallow multiple spaces (vue/no-multi-spaces)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

This rule aims to remove multiple spaces in a row between attributes which are not used for indentation.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div     class="foo"
      :style="bar"         />
```

```html
<i
  :class="{
    'fa-angle-up'   : isExpanded,
    'fa-angle-down' : !isExpanded,
  }"
/>
```

Examples of **correct** code for this rule:

```html
<div
  class="foo"
  :style="bar"
/>
```

```html
<i
  :class="{
    'fa-angle-up' : isExpanded,
    'fa-angle-down' : !isExpanded,
  }"
/>
```

## :wrench: Options

This rule has an object option:

`"ignoreProperties": false` (default) whether or not objects' properties should be ignored

### Example:

```json
"vue/no-multi-spaces": [2, {
  "ignoreProperties": true
}]
```

:+1: Examples of **correct** code for this rule:

```html
<i
  :class="{
    'fa-angle-up'   : isExpanded,
    'fa-angle-down' : !isExpanded,
  }"
/>
```
