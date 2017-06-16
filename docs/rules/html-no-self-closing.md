# Disallow self-closing elements (html-no-self-closing)

- 🔧 This rule is fixable with `eslint --fix` command.

Self-closing (e.g. `<br/>`) is syntax of XML/XHTML.
HTML ignores it.

## 📖 Rule Details

This rule reports every self-closing element except XML context.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <img src="./logo.png"/>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

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

## 🔧 Options

Nothing.
