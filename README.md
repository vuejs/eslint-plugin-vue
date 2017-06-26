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

```
npm install --save-dev eslint eslint-plugin-vue@beta
```

## :rocket: Usage

Create `.eslintrc.*` file to configure rules. See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended' // or 'plugin:vue/base'
  ],
  rules: {
    // override/add rules' settings here
    'vue/no-invalid-v-if': 'error'
  }
}
```

## ⚙ Configs

This plugin provides two predefined configs:
- `plugin:vue/base` - contains necessary settings for this plugin to work properly
- `plugin:vue/recommended` - extends base config with recommended rules (the ones with check mark :white_check_mark: in the table below)

## :bulb: Rules

Rules are grouped by category to help you understand their purpose.

No rules are enabled by `plugin:vue/base` config. The `plugin:vue/recommended` config enables rules that report common problems, which have a check mark :white_check_mark: below.

The `--fix` option on the command line automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Best Practices

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [html-end-tags](./docs/rules/html-end-tags.md) | enforce end tag style. |
| :white_check_mark::wrench: | [html-no-self-closing](./docs/rules/html-no-self-closing.md) | disallow self-closing elements. |
| :white_check_mark: | [no-confusing-v-for-v-if](./docs/rules/no-confusing-v-for-v-if.md) | disallow confusing `v-for` and `v-if` on the same element. |
|  | [no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md) | disallow duplicate arguments. |
| :white_check_mark: | [no-textarea-mustache](./docs/rules/no-textarea-mustache.md) | disallow mustaches in `<textarea>`. |
|  | [order-in-components](./docs/rules/order-in-components.md) | Keep order of properties in components |
| :white_check_mark: | [require-component-is](./docs/rules/require-component-is.md) | require `v-bind:is` of `<component>` elements. |
| :white_check_mark: | [require-v-for-key](./docs/rules/require-v-for-key.md) | require `v-bind:key` with `v-for` directives. |


### Stylistic Issues

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [html-quotes](./docs/rules/html-quotes.md) | enforce quotes style of HTML attributes. |
| :wrench: | [v-bind-style](./docs/rules/v-bind-style.md) | enforce v-bind directive style. |
| :wrench: | [v-on-style](./docs/rules/v-on-style.md) | enforce v-on directive style. |


### Variables

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [jsx-uses-vars](./docs/rules/jsx-uses-vars.md) | Prevent variables used in JSX to be marked as unused |


### Possible Errors

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [no-invalid-template-root](./docs/rules/no-invalid-template-root.md) | disallow invalid template root. |
| :white_check_mark: | [no-invalid-v-bind](./docs/rules/no-invalid-v-bind.md) | disallow invalid v-bind directives. |
| :white_check_mark: | [no-invalid-v-cloak](./docs/rules/no-invalid-v-cloak.md) | disallow invalid v-cloak directives. |
| :white_check_mark: | [no-invalid-v-else-if](./docs/rules/no-invalid-v-else-if.md) | disallow invalid v-else-if directives. |
| :white_check_mark: | [no-invalid-v-else](./docs/rules/no-invalid-v-else.md) | disallow invalid v-else directives. |
| :white_check_mark: | [no-invalid-v-for](./docs/rules/no-invalid-v-for.md) | disallow invalid v-for directives. |
| :white_check_mark: | [no-invalid-v-html](./docs/rules/no-invalid-v-html.md) | disallow invalid v-html directives. |
| :white_check_mark: | [no-invalid-v-if](./docs/rules/no-invalid-v-if.md) | disallow invalid v-if directives. |
| :white_check_mark: | [no-invalid-v-model](./docs/rules/no-invalid-v-model.md) | disallow invalid v-model directives. |
| :white_check_mark: | [no-invalid-v-on](./docs/rules/no-invalid-v-on.md) | disallow invalid v-on directives. |
| :white_check_mark: | [no-invalid-v-once](./docs/rules/no-invalid-v-once.md) | disallow invalid v-once directives. |
| :white_check_mark: | [no-invalid-v-pre](./docs/rules/no-invalid-v-pre.md) | disallow invalid v-pre directives. |
| :white_check_mark: | [no-invalid-v-show](./docs/rules/no-invalid-v-show.md) | disallow invalid v-show directives. |
| :white_check_mark: | [no-invalid-v-text](./docs/rules/no-invalid-v-text.md) | disallow invalid v-text directives. |
| :white_check_mark: | [no-parsing-error](./docs/rules/no-parsing-error.md) | disallow parsing errors in `<template>`. |

<!--RULES_TABLE_END-->

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
