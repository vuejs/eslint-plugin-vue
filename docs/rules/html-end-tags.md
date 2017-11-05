# enforce end tag style (html-end-tags)

- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports:

- presence of end tags on [Void elements](https://www.w3.org/TR/html51/syntax.html#void-elements)
- absence of end tags or self-closed endings on other elements

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div>
        <p>
        <p>
        <input></input>
        <br></br>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div></div>
        <p></p>
        <p></p>
        <div />
        <input>
        <br>
    </div>
</template>
```

## :wrench: Options

Nothing.
