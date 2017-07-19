# Disallow self-closing elements (html-no-self-closing)

- :wrench: This rule is fixable with `eslint --fix` command.

Self-closing (e.g. `<br/>`) is syntax of XML/XHTML.
HTML ignores it.

## :book: Rule Details

This rule reports every self-closing element except XML context.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <img src="./logo.png"/>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <img src="./logo.png">
        <svg>
            <!-- this is XML context -->
            <rect width="100" height="100" />
        </svg>
    </div>
</template>
```

## :wrench: Options

Nothing.
