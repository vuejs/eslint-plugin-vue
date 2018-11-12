# enforce valid `slot-scope` attributes (vue/valid-slot-scope)

This rule checks whether every `slot-scope` (or `scope`) attributes is valid.

## :book: Rule Details

This rule reports `slot-scope` attributes in the following cases:

- The `slot-scope` attribute does not have that attribute value. E.g. `<div slot-scope></div>`
- The `slot-scope` attribute have the attribute value which is extra access to slot data. E.g. `<div slot-scope="prop, extra"></div>`
- The `slot-scope` attribute have the attribute value which is rest parameter. E.g. `<div slot-scope="...props"></div>`

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
  <TheComponent>
    <template slot-scope="a, b, c">
      <!-- `b` and `c` are extra access. -->
      ...
    </template>
  </TheComponent>
  <TheComponent>
    <template slot-scope="...props">
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


[no-parsing-error]: no-parsing-error.md
