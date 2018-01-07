# disallow multiple spaces (vue/no-multi-spaces)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

This rule aims to remove multiple spaces in a row between attributes witch are not used for indentation.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div     class="foo"
      :style="bar"         />
```

Examples of **correct** code for this rule:

```html
<div
  class="foo"
  :style="bar"
/>
```

### Options

Nothing
