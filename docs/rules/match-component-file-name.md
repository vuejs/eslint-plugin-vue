# require component name property to match its file name (vue/match-component-file-name)

- :gear: This rule is included in `"plugin:vue/recommended"`.

You can choose which file extension this rule should verify the component's name:

- `.jsx` (**default**): `jsx`
- `.jsx` and `.vue`: `both`

By default this rule will only verify components in a file with a `.jsx` 
extension. Files with `.vue` extension uses their resgistered name by default. 
The only use case where you need to specify a name for your component 
in a `.vue` file is when implementing recursive components.

The option to verify both files extensions is added to increase 
consistency in projects where its style guide requires every component 
to have a `name` property, although, as stated above it is unnecessary.  

## :book: Rule Details

This rule reports if a component `name` property does not match its file name.

:-1: Examples of **incorrect** code for this rule:

```jsx
// file name: src/MyComponent.jsx
export default {
  name: 'MComponent', // note the missing y
  render: () {
    return <h1>Hello world</h1>
  }
}
```

:+1: Examples of **correct** code for this rule:

```jsx
// file name: src/MyComponent.jsx
export default {
  name: 'MyComponent',
  render: () {
    return <h1>Hello world</h1>
  }
}
```

## :wrench: Options

- `"jsx"` (default) ... verify components in files with `.jsx` extension.
- `"both"` ... verify components in files with both `.jsx` and `.vue` extensions.
