# Enforce quotes style of HTML attributes (html-quotes)

You can shoose quotes of HTML attributes from:

- Double quotes: `<div class="foo">`
- Single quotes: `<div class='foo'>`
- No quotes: `<div class=foo>`

This rule enforces the quotes style of HTML attributes.

## 📖 Rule Details

This rule reports the quotes of attributes if it is different to configured quotes.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <img src='./logo.png'>
        <img src=./logo.png>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <img src="./logo.png">
    </div>
</template>
```

👎 Examples of **incorrect** code for this rule with `"single"` option:

```html
<template>
    <div>
        <img src="./logo.png">
        <img src=./logo.png>
    </div>
</template>
```

👍 Examples of **correct** code for this rule with `"single"` option:

```html
<template>
    <div>
        <img src='./logo.png'>
    </div>
</template>
```

## 🔧 Options

- `"double"` (default) ... requires double quotes.
- `"single"` ... requires single quotes.
