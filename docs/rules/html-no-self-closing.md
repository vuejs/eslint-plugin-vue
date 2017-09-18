# disallow self-closing elements (html-no-self-closing)

- :warning: This rule was **deprecated** and replaced by [html-self-closing](html-self-closing.md) rule.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

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
