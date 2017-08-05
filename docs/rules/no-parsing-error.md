# Disallow parsing errors in `<template>` (no-parsing-error)

This rule reports syntax errors in `<template>`. For example:

- Syntax errors of scripts in directives.
- Syntax errors of scripts in mustaches.
- Syntax errors of HTML.
    - Invalid end tags.
    - Attributes in end tags.
    - ...
    - See also: https://html.spec.whatwg.org/multipage/parsing.html#parse-errors

## :book: Rule Details

This rule tries to parse directives/mustaches in `<template>` by the parser which parses `<script>`.
Then reports syntax errors if exist.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
    <div>{{message.}}</div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
    <div>{{message}}</div>
</template>
```

## :wrench: Options

```json
{
    "vue/no-parsing-error": ["error", {
        "abrupt-closing-of-empty-comment": false,
        "absence-of-digits-in-numeric-character-reference": false,
        "cdata-in-html-content": false,
        "character-reference-outside-unicode-range": false,
        "control-character-in-input-stream": false,
        "control-character-reference": false,
        "eof-before-tag-name": false,
        "eof-in-cdata": false,
        "eof-in-comment": false,
        "eof-in-tag": false,
        "incorrectly-closed-comment": false,
        "incorrectly-opened-comment": false,
        "invalid-first-character-of-tag-name": false,
        "missing-attribute-value": false,
        "missing-end-tag-name": false,
        "missing-semicolon-after-character-reference": false,
        "missing-whitespace-between-attributes": false,
        "nested-comment": false,
        "noncharacter-character-reference": false,
        "noncharacter-in-input-stream": false,
        "null-character-reference": false,
        "surrogate-character-reference": false,
        "surrogate-in-input-stream": false,
        "unexpected-character-in-attribute-name": false,
        "unexpected-character-in-unquoted-attribute-value": false,
        "unexpected-equals-sign-before-attribute-name": false,
        "unexpected-null-character": false,
        "unexpected-question-mark-instead-of-tag-name": false,
        "unexpected-solidus-in-tag": false,
        "unknown-named-character-reference": false,
        "end-tag-with-attributes": false,
        "duplicate-attribute": false,
        "end-tag-with-trailing-solidus": false,
        "non-void-html-element-start-tag-with-trailing-solidus": false,
        "x-invalid-end-tag": false,
        "x-invalid-namespace": false
    }]
}
```

You can enable HTML syntax errors by opt-in.

For example, if `"x-invalid-end-tag": true` is given then this rule will catch the end tags of elements which have not opened.
The error codes are defined in [WHATWG spec](https://html.spec.whatwg.org/multipage/parsing.html#parse-errors), but this rule does not support all of those (E.g., it does not catch errors about DOCTYPE).
Also, The codes which have `x-` prefix are original in this rule because errors in tree construction phase have not codified yet.

- `x-invalid-end-tag` enables the errors about the end tags of elements which have not opened.
- `x-invalid-namespace` enables the errors about invalid `xmlns` attributes. See also [step 10. of "create an element for a token"](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token).

> TODO(mysticatea): I will revisit errors in tree construction phase after those are codified.
