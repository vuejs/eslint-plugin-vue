# require `v-bind:is` of `<component>` elements (vue/require-component-is)

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

> You can use the same mount point and dynamically switch between multiple components using the reserved `<component>` element and dynamically bind to its `is` attribute:
>
> https://vuejs.org/v2/guide/components.html#Dynamic-Components

## :book: Rule Details

This rule reports the `<component>` elements which do not have `v-bind:is` attributes.

:-1: Examples of **incorrect** code for this rule:

```html
<component/>
<component is="type"/>
```

:+1: Examples of **correct** code for this rule:

```html
<component :is="type"/>
<component v-bind:is="type"/>
```

## :wrench: Options

Nothing.
