# enforce valid `slot-scope` attributes (vue/valid-slot-scope)

This rule checks whether every `slot-scope` (or `scope`) attributes is valid.

## :book: Rule Details

This rule reports `slot-scope` attributes in the following cases:

- The `slot-scope` attribute does not have that attribute value. E.g. `<div slot-scope></div>`

This rule does not check syntax errors in directives because it's checked by [no-parsing-error] rule.

:-1: Examples of **incorrect** code for this rule:

```vue
<template>
  <TheComponent>
    <template slot-scope>
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="">
      ...
    </template>
  </TheComponent>
</template>
```

:+1: Examples of **correct** code for this rule:

```vue
<template>
  <TheComponent>
    <template slot-scope="prop">
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="{ a, b, c }">
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="[ a, b, c ]">
      ...
    </template>
  </TheComponent>
</template>
```

## :wrench: Options

Nothing.

## :couple: Related rules

- [no-parsing-error]

## Related links

- [Guide - Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots)

[no-parsing-error]: no-parsing-error.md
