# Disallow invalid v-for directives (no-invalid-v-for)

This rule checks whether every `v-for` directive is valid.

## 📖 Rule Details

This rule reports `v-for` directives in the following cases:

- The directive has that argument. E.g. `<div v-for:aaa></div>`
- The directive has that modifier. E.g. `<div v-for.bbb></div>`
- The directive does not have that attribute value. E.g. `<div v-for></div>`
- If the element which has the directive is a custom component, the component does not have `v-bind:key` directive. E.g. `<your-component v-for="item in list"></your-component>`
- The `v-bind:key` directive does not use the variables which are defined by the `v-for` directive. E.g. `<div v-for="x in list" :key="foo"></div>`

If the element which has the directive is a reserved element, this rule does not report even if the element does not have `v-bind:key` directive because it's not faital error. [require-v-for-key] rule reports it.

This rule does not check syntax errors in directives. [no-parsing-error] rule reports it.
The following cases are syntax errors:

- The directive's value is not the form `alias in expr`. E.g. `<div v-for="foo"></div>`
- The alias is not LHS. E.g. `<div v-for="foo() in list"></div>`

👎 Examples of **incorrect** code for this rule:

```html
<template>
    <div v-for="x in list">
        <div v-for></div>
        <div v-for:aaa="x in list"></div>
        <div v-for.bbb="x in list"></div>
        <your-component v-for="x in list"></your-component>
        <div is="your-component" v-for="x in list"></div>
        <your-component  v-for="x in list" :key="foo"></your-component>
    </div>
</template>
```

👍 Examples of **correct** code for this rule:

```html
<template>
    <div>
        <div v-for="x in list"></div>
        <your-component v-for="x in list" :key="x.id"></your-component>
        <div is="your-component" v-for="x in list" :key="x.id"></div>
    </div>
</template>
```

## 🔧 Options

Nothing.

## 👫 Related rules

- [require-v-for-key]
- [no-parsing-error]


[no-parsing-error]: no-parsing-error.md
