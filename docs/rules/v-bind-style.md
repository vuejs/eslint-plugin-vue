# Enforce v-bind directive style (v-bind-style)

- 🔧 This rule is fixable with `eslint --fix` command.

This rule enforces `v-bind` directive style which you should use shorthand or long form.

## 📖 Rule Details

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-bind:foo="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div :foo="foo"></div>
    </div>
</template>
```

👎 Examples of **incorrect** code for this rule with `"longform"` option:

```html
<template>
    <div>
        <div :foo="foo"></div>
    </div>
</template>
```

👍 Examples of **correct** code for this rule with `"longform"` option:

```html
<template>
    <div>
        <div v-bind:foo="foo"></div>
    </div>
</template>
```

## 🔧 Options

- `"shorthand"` (default) ... requires using shorthand.
- `"longform"` ... requires using long form.
