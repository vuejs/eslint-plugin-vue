# Enforce quotes style of HTML attributes (html-quotes)

You can choose quotes of HTML attributes from:

- Double quotes: `<div class="foo">`
- Single quotes: `<div class='foo'>`
- No quotes: `<div class=foo>`

This rule enforces the quotes style of HTML attributes.

## :book: Rule Details

This rule reports the quotes of attributes if it is different to configured quotes.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <img src='./logo.png'>
        <img src=./logo.png>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <img src="./logo.png">
    </div>
</template>
```

:-1: Examples of **incorrect** code for this rule with `"single"` option:

```html
<template>
    <div>
        <img src="./logo.png">
        <img src=./logo.png>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule with `"single"` option:

```html
<template>
    <div>
        <img src='./logo.png'>
    </div>
</template>
```

## :wrench: Options

- `"double"` (default) ... requires double quotes.
- `"single"` ... requires single quotes.
