# Enforce end tag style (html-end-tags)

- 🔧 This rule is fixable with `eslint --fix` command.

This rule enforce the way of end tags.

- [Void elements] disallow end tags.
- Other elements require end tags.

## 📖 Rule Details

This rule reports the following elements:

- [Void elements] which have end tags.
- Other elements which do not have end tags and are not self-closing.

👎 Examples of **incorrect** code for this rule:

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

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div></div>
        <p></p>
        <p></p>
        <input>
        <br>
    </div>
</template>
```

## 🔧 Options

Nothing.

[Void elements]: https://www.w3.org/TR/html51/syntax.html#void-elements

## TODO: `<br></br>`

`parse5` does not recognize the illegal end tags of void elements.
