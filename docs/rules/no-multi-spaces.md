# This rule warns about the usage of extra whitespaces between attributes (no-multi-spaces)

The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

This rule aims to remove multiple spaces in a row between attributes witch are not used for indentation.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<template>
  <div class="foo"      :style="foo"
    :foo="bar"         >
  </div>
</template>
```

Examples of **correct** code for this rule:

```html
<template>
  <div class="foo"
    :style="foo">
  </div>
</template>
```

### Options

Nothing
