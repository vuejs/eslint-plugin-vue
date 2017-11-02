# eslint-plugin-vue

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![CircleCI](https://circleci.com/gh/vuejs/eslint-plugin-vue.svg?style=svg)](https://circleci.com/gh/vuejs/eslint-plugin-vue)

> Official ESLint plugin for Vue.js

## :exclamation: Attention - this is documentation for beta `3.0.0` :exclamation:

This branch contains `eslint-plugin-vue@beta` which is pre-released `3.0`, but it's not the default version that you get with `npm install eslint-plugin-vue`. In order to install this you need to specify either `"eslint-plugin-vue": "beta"` in `package.json` or do `npm install eslint-plugin-vue@beta`.

Please try it and report any issues that you might experience.

If you want to check previous releases [go here](https://github.com/vuejs/eslint-plugin-vue/releases).

## :grey_exclamation: Requirements

- [ESLint](http://eslint.org/) `>=3.18.0`.
- Node.js `>=4.0.0`

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-vue@beta
```

## :rocket: Usage

Create `.eslintrc.*` file to configure rules. See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended' // or 'plugin:vue/base'
  ],
  rules: {
    // override/add rules' settings here
    'vue/valid-v-if': 'error'
  }
}
```

### Attention

All component-related rules are being applied to code that passes any of the following checks:

* `Vue.component()` expression
* `export default {}` in `.vue` or `.jsx` file

If you however want to take advantage of our rules in any of your custom objects that are Vue components, you might need to use special comment `// @vue/component` that marks object in the next line as a Vue component in any file, e.g.:

```js
// @vue/component
const CustomComponent = {
  name: 'custom-component',
  template: '<div></div>'
}
```
```js
Vue.component('AsyncComponent', (resolve, reject) => {
  setTimeout(() => {
    // @vue/component
    resolve({
      name: 'async-component',
      template: '<div></div>'
    })
  }, 500)
})
```

## :gear: Configs

This plugin provides two predefined configs:
- `plugin:vue/base` - contains necessary settings for this plugin to work properly
- `plugin:vue/recommended` - extends base config with recommended rules (the ones with check mark :white_check_mark: in the table below)

## :bulb: Rules

Rules are grouped by category to help you understand their purpose.

No rules are enabled by `plugin:vue/base` config. The `plugin:vue/recommended` config enables rules that report common problems, which have a check mark :white_check_mark: below.

The `--fix` option on the command line automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Possible Errors

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [no-dupe-keys](./docs/rules/no-dupe-keys.md) | disallow duplication of field names |
| :white_check_mark: | [no-parsing-error](./docs/rules/no-parsing-error.md) | disallow parsing errors in `<template>` |
|  | [no-reserved-keys](./docs/rules/no-reserved-keys.md) | disallow overwriting reserved keys |
|  | [no-shared-component-data](./docs/rules/no-shared-component-data.md) | enforce component's data property to be a function |
|  | [no-template-key](./docs/rules/no-template-key.md) | disallow `key` attribute on `<template>` |
|  | [no-unused-vars](./docs/rules/no-unused-vars.md) | disallow unused variable definitions of v-for directives or scope attributes |
|  | [require-render-return](./docs/rules/require-render-return.md) | enforce render function to always return value |
|  | [require-valid-default-prop](./docs/rules/require-valid-default-prop.md) | enforce props default values to be valid |
|  | [return-in-computed-property](./docs/rules/return-in-computed-property.md) | enforce that a return statement is present in computed property |
| :white_check_mark: | [valid-template-root](./docs/rules/valid-template-root.md) | enforce valid template root |
| :white_check_mark: | [valid-v-bind](./docs/rules/valid-v-bind.md) | enforce valid `v-bind` directives |
| :white_check_mark: | [valid-v-cloak](./docs/rules/valid-v-cloak.md) | enforce valid `v-cloak` directives |
| :white_check_mark: | [valid-v-else-if](./docs/rules/valid-v-else-if.md) | enforce valid `v-else-if` directives |
| :white_check_mark: | [valid-v-else](./docs/rules/valid-v-else.md) | enforce valid `v-else` directives |
| :white_check_mark: | [valid-v-for](./docs/rules/valid-v-for.md) | enforce valid `v-for` directives |
| :white_check_mark: | [valid-v-html](./docs/rules/valid-v-html.md) | enforce valid `v-html` directives |
| :white_check_mark: | [valid-v-if](./docs/rules/valid-v-if.md) | enforce valid `v-if` directives |
| :white_check_mark: | [valid-v-model](./docs/rules/valid-v-model.md) | enforce valid `v-model` directives |
| :white_check_mark: | [valid-v-on](./docs/rules/valid-v-on.md) | enforce valid `v-on` directives |
| :white_check_mark: | [valid-v-once](./docs/rules/valid-v-once.md) | enforce valid `v-once` directives |
| :white_check_mark: | [valid-v-pre](./docs/rules/valid-v-pre.md) | enforce valid `v-pre` directives |
| :white_check_mark: | [valid-v-show](./docs/rules/valid-v-show.md) | enforce valid `v-show` directives |
| :white_check_mark: | [valid-v-text](./docs/rules/valid-v-text.md) | enforce valid `v-text` directives |


### Best Practices

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [html-end-tags](./docs/rules/html-end-tags.md) | enforce end tag style |
|  | [no-async-in-computed-properties](./docs/rules/no-async-in-computed-properties.md) | disallow asynchronous actions in computed properties |
| :white_check_mark: | [no-confusing-v-for-v-if](./docs/rules/no-confusing-v-for-v-if.md) | disallow confusing `v-for` and `v-if` on the same element |
|  | [no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md) | disallow duplication of attributes |
|  | [no-side-effects-in-computed-properties](./docs/rules/no-side-effects-in-computed-properties.md) | disallow side effects in computed properties |
| :white_check_mark: | [no-textarea-mustache](./docs/rules/no-textarea-mustache.md) | disallow mustaches in `<textarea>` |
|  | [order-in-components](./docs/rules/order-in-components.md) | enforce order of properties in components |
| :white_check_mark: | [require-component-is](./docs/rules/require-component-is.md) | require `v-bind:is` of `<component>` elements |
|  | [require-default-prop](./docs/rules/require-default-prop.md) | require default value for props |
|  | [require-prop-types](./docs/rules/require-prop-types.md) | require type definitions in props |
| :white_check_mark: | [require-v-for-key](./docs/rules/require-v-for-key.md) | require `v-bind:key` with `v-for` directives |
|  | [this-in-template](./docs/rules/this-in-template.md) | enforce usage of `this` in template |


### Stylistic Issues

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [attribute-hyphenation](./docs/rules/attribute-hyphenation.md) | enforce attribute naming style in template |
| :wrench: | [html-indent](./docs/rules/html-indent.md) | enforce consistent indentation in `<template>` |
|  | [html-quotes](./docs/rules/html-quotes.md) | enforce quotes style of HTML attributes |
| :wrench: | [html-self-closing](./docs/rules/html-self-closing.md) | enforce self-closing style |
|  | [max-attributes-per-line](./docs/rules/max-attributes-per-line.md) | enforce the maximum number of attributes per line |
| :wrench: | [mustache-interpolation-spacing](./docs/rules/mustache-interpolation-spacing.md) | enforce unified spacing in mustache interpolations |
| :wrench: | [name-property-casing](./docs/rules/name-property-casing.md) | enforce specific casing for the name property in Vue components |
| :wrench: | [no-multi-spaces](./docs/rules/no-multi-spaces.md) | disallow multiple spaces |
| :wrench: | [v-bind-style](./docs/rules/v-bind-style.md) | enforce `v-bind` directive style |
| :wrench: | [v-on-style](./docs/rules/v-on-style.md) | enforce `v-on` directive style |


### Variables

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [jsx-uses-vars](./docs/rules/jsx-uses-vars.md) | prevent variables used in JSX to be marked as unused |

### Deprecated

> - :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
> - :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
| [html-no-self-closing](./docs/rules/html-no-self-closing.md) | [html-self-closing](./docs/rules/html-self-closing.md) |
| [no-invalid-template-root](./docs/rules/no-invalid-template-root.md) | [valid-template-root](./docs/rules/valid-template-root.md) |
| [no-invalid-v-bind](./docs/rules/no-invalid-v-bind.md) | [valid-v-bind](./docs/rules/valid-v-bind.md) |
| [no-invalid-v-cloak](./docs/rules/no-invalid-v-cloak.md) | [valid-v-cloak](./docs/rules/valid-v-cloak.md) |
| [no-invalid-v-else-if](./docs/rules/no-invalid-v-else-if.md) | [valid-v-else-if](./docs/rules/valid-v-else-if.md) |
| [no-invalid-v-else](./docs/rules/no-invalid-v-else.md) | [valid-v-else](./docs/rules/valid-v-else.md) |
| [no-invalid-v-for](./docs/rules/no-invalid-v-for.md) | [valid-v-for](./docs/rules/valid-v-for.md) |
| [no-invalid-v-html](./docs/rules/no-invalid-v-html.md) | [valid-v-html](./docs/rules/valid-v-html.md) |
| [no-invalid-v-if](./docs/rules/no-invalid-v-if.md) | [valid-v-if](./docs/rules/valid-v-if.md) |
| [no-invalid-v-model](./docs/rules/no-invalid-v-model.md) | [valid-v-model](./docs/rules/valid-v-model.md) |
| [no-invalid-v-on](./docs/rules/no-invalid-v-on.md) | [valid-v-on](./docs/rules/valid-v-on.md) |
| [no-invalid-v-once](./docs/rules/no-invalid-v-once.md) | [valid-v-once](./docs/rules/valid-v-once.md) |
| [no-invalid-v-pre](./docs/rules/no-invalid-v-pre.md) | [valid-v-pre](./docs/rules/valid-v-pre.md) |
| [no-invalid-v-show](./docs/rules/no-invalid-v-show.md) | [valid-v-show](./docs/rules/valid-v-show.md) |
| [no-invalid-v-text](./docs/rules/no-invalid-v-text.md) | [valid-v-text](./docs/rules/valid-v-text.md) |
| [no-reservered-keys](./docs/rules/no-reservered-keys.md) | [no-reserved-keys](./docs/rules/no-reserved-keys.md) |

<!--RULES_TABLE_END-->

## :couple: FAQ

### What is the "Use the latest vue-eslint-parser" error?

The most rules of `eslint-plugin-vue` require `vue-eslint-parser` to check `<template>` ASTs.

Make sure you have one of the following settings in your **.eslintrc**:

- `"extends": ["plugin:vue/recommended"]`
- `"extends": ["plugin:vue/base"]`

If you already use other parser (e.g. `"parser": "babel-eslint"`), please move it into `parserOptions`, so it doesn't collide with the `vue-eslint-parser` used by this plugin's configuration:

```diff
- "parser": "babel-eslint",
  "parserOptions": {
+     "parser": "babel-eslint",
      "ecmaVersion": 2017,
      "sourceType": "module"
  }
```

The `vue-eslint-parser` uses the parser which is set by `parserOptions.parser` to parse scripts.

## :anchor: Semantic Versioning Policy

This plugin follows [semantic versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## :newspaper: Changelog

We're using [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases).

## :beers: Contribution guide

In order to add a new rule, you should:
- Create issue on GH with description of proposed rule
- Generate a new rule using the [official yeoman generator](https://github.com/eslint/generator-eslint)
- Run `npm start`
- Write test scenarios & implement logic
- Describe the rule in the generated `docs` file
- Make sure all tests are passing
- Run `npm run update` in order to update readme and recommended configuration
- Create PR and link created issue in description

We're more than happy to see potential contributions, so don't hesitate. If you have any suggestions, ideas or problems feel free to add new [issue](https://github.com/vuejs/eslint-plugin-vue/issues), but first please make sure your question does not repeat previous ones.

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
