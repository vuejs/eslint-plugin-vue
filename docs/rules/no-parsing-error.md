# Disallow parsing errors in `<template>` (no-parsing-error)

This rule reports syntax errors in directives/mustaches of `<template>`.

## 📖 Rule Details

This rule tries to parse directives/mustaches in `<template>` by the parser which parses `<script>`.
Then reports syntax errors if exist.

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div>{{message.}}</div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>{{message}}</div>
</template>
```

## 🔧 Options

Nothing.
