# Require `v-bind:key` with `v-for` directives (require-v-for-key)

When `v-for` is written on custom components, it requires `v-bind:key` at the same time.
On other elements, it's better that `v-bind:key` is written as well.

## :book: Rule Details

This rule reports the elements which have `v-for` and do not have `v-bind:key`.

This rule does not report custom components.
It will be reported by [no-invalid-v-for] rule.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>
        <div v-for="x in list"></div>
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-for="x in list" :key="x.id"></div>
    </div>
</template>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-invalid-v-for]

[no-invalid-v-for]: ./no-invalid-v-for.md
