# Enforce v-on directive style (v-on-style)

- :wrench: This rule is fixable with `eslint --fix` command.

This rule enforces `v-on` directive style which you should use shorthand or long form.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-on:click="foo"></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div @click="foo"></div>
    </div>
</template>
```

:-1: Examples of **incorrect** code for this rule with `"longform"` option:

```html
<template>
    <div>
        <div @click="foo"></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule with `"longform"` option:

```html
<template>
    <div>
        <div v-on:click="foo"></div>
    </div>
</template>
```

## :wrench: Options

- `"shorthand"` (default) ... requires using shorthand.
- `"longform"` ... requires using long form.
