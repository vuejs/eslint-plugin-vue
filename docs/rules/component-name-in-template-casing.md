# enforce specific casing for the component naming style in template (vue/component-name-in-template-casing)

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Define a style for the component name in template casing for consistency purposes.

## :book: Rule Details

:+1: Examples of **correct** code for `PascalCase`:

```html
<template>
  <TheComponent />
</template>
```

:-1: Examples of **incorrect** code for `PascalCase`:

```html
<template>
  <the-component />
  <theComponent />
  <The-component />
</template>
```

:+1: Examples of **correct** code for `kebab-case`:

```html
<template>
  <the-component />
</template>
```

:-1: Examples of **incorrect** code for `kebab-case`:

```html
<template>
  <TheComponent />
  <theComponent />
  <Thecomponent />
  <The-component />
</template>
```

## :wrench: Options

Default casing is set to `PascalCase`.

```json
  "vue/component-name-in-template-casing": ["error",
    "PascalCase|kebab-case",
    {
      "ignores": []
    }
  ]
```

- `ignores` (`string[]`) ... The element name to ignore. Sets the element name to allow. For example, a custom element or a non-Vue component.


:+1: Examples of **correct** code for `{ignores: ["custom-element"]}`:

```html
<template>
  <custom-element></custom-element>
  <TheComponent/>
</template>
```

## Related links

- [Style guide - Component name casing in templates](https://vuejs.org/v2/style-guide/#Component-name-casing-in-templates-strongly-recommended)
