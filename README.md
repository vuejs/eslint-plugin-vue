# eslint-plugin-vue

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![CircleCI](https://circleci.com/gh/vuejs/eslint-plugin-vue.svg?style=svg)](https://circleci.com/gh/vuejs/eslint-plugin-vue)

> Official ESLint plugin for Vue.js

## :art: Playground on the Web

You can try this plugin on the Web.

- https://mysticatea.github.io/vue-eslint-demo/

## :grey_exclamation: Requirements

- [ESLint](http://eslint.org/) `>=3.18.0`.
- Node.js `>=4.0.0`

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-vue
```

## :rocket: Usage

Create `.eslintrc.*` file to configure rules. See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/essential'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
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

### `eslint-disable` functionality in `<template>`

You can use `<!-- eslint-disable -->`-like HTML comments in `<template>` of `.vue` files. For example:

```html
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4">
  </div>
</template>
```

If you want to disallow `eslint-disable` functionality, please disable [vue/comment-directive](./docs/rules/comment-directive.md) rule.

## :gear: Configs

This plugin provides two predefined configs:
- `plugin:vue/base` - Settings and rules to enable correct ESLint parsing
- `plugin:vue/essential` - Above, plus rules to prevent errors or unintended behavior
- `plugin:vue/strongly-recommended` - Above, plus rules to considerably improve code readability and/or dev experience
- `plugin:vue/recommended` - Above, plus rules to enforce subjective community defaults to ensure consistency

## :bulb: Rules

Rules are grouped by priority to help you understand their purpose. The `--fix` option on the command line automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Base Rules (Enabling Correct ESLint Parsing)

Enforce all the rules in this category, as well as all higher priority rules, with:

```json
{
  "extends": "plugin:vue/base"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [vue/comment-directive](./docs/rules/comment-directive.md) | support comment-directives in `<template>` |
|  | [vue/jsx-uses-vars](./docs/rules/jsx-uses-vars.md) | prevent variables used in JSX to be marked as unused |

### Priority A: Essential (Error Prevention)

Enforce all the rules in this category, as well as all higher priority rules, with:

```json
{
  "extends": "plugin:vue/essential"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [vue/no-async-in-computed-properties](./docs/rules/no-async-in-computed-properties.md) | disallow asynchronous actions in computed properties |
|  | [vue/no-dupe-keys](./docs/rules/no-dupe-keys.md) | disallow duplication of field names |
|  | [vue/no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md) | disallow duplication of attributes |
|  | [vue/no-parsing-error](./docs/rules/no-parsing-error.md) | disallow parsing errors in `<template>` |
|  | [vue/no-reserved-keys](./docs/rules/no-reserved-keys.md) | disallow overwriting reserved keys |
| :wrench: | [vue/no-shared-component-data](./docs/rules/no-shared-component-data.md) | enforce component's data property to be a function |
|  | [vue/no-side-effects-in-computed-properties](./docs/rules/no-side-effects-in-computed-properties.md) | disallow side effects in computed properties |
|  | [vue/no-template-key](./docs/rules/no-template-key.md) | disallow `key` attribute on `<template>` |
|  | [vue/no-textarea-mustache](./docs/rules/no-textarea-mustache.md) | disallow mustaches in `<textarea>` |
|  | [vue/no-unused-vars](./docs/rules/no-unused-vars.md) | disallow unused variable definitions of v-for directives or scope attributes |
|  | [vue/require-component-is](./docs/rules/require-component-is.md) | require `v-bind:is` of `<component>` elements |
|  | [vue/require-render-return](./docs/rules/require-render-return.md) | enforce render function to always return value |
|  | [vue/require-v-for-key](./docs/rules/require-v-for-key.md) | require `v-bind:key` with `v-for` directives |
|  | [vue/require-valid-default-prop](./docs/rules/require-valid-default-prop.md) | enforce props default values to be valid |
|  | [vue/return-in-computed-property](./docs/rules/return-in-computed-property.md) | enforce that a return statement is present in computed property |
|  | [vue/valid-template-root](./docs/rules/valid-template-root.md) | enforce valid template root |
|  | [vue/valid-v-bind](./docs/rules/valid-v-bind.md) | enforce valid `v-bind` directives |
|  | [vue/valid-v-cloak](./docs/rules/valid-v-cloak.md) | enforce valid `v-cloak` directives |
|  | [vue/valid-v-else-if](./docs/rules/valid-v-else-if.md) | enforce valid `v-else-if` directives |
|  | [vue/valid-v-else](./docs/rules/valid-v-else.md) | enforce valid `v-else` directives |
|  | [vue/valid-v-for](./docs/rules/valid-v-for.md) | enforce valid `v-for` directives |
|  | [vue/valid-v-html](./docs/rules/valid-v-html.md) | enforce valid `v-html` directives |
|  | [vue/valid-v-if](./docs/rules/valid-v-if.md) | enforce valid `v-if` directives |
|  | [vue/valid-v-model](./docs/rules/valid-v-model.md) | enforce valid `v-model` directives |
|  | [vue/valid-v-on](./docs/rules/valid-v-on.md) | enforce valid `v-on` directives |
|  | [vue/valid-v-once](./docs/rules/valid-v-once.md) | enforce valid `v-once` directives |
|  | [vue/valid-v-pre](./docs/rules/valid-v-pre.md) | enforce valid `v-pre` directives |
|  | [vue/valid-v-show](./docs/rules/valid-v-show.md) | enforce valid `v-show` directives |
|  | [vue/valid-v-text](./docs/rules/valid-v-text.md) | enforce valid `v-text` directives |

### Priority B: Strongly Recommended (Improving Readability)

Enforce all the rules in this category, as well as all higher priority rules, with:

```json
{
  "extends": "plugin:vue/strongly-recommended"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [vue/attribute-hyphenation](./docs/rules/attribute-hyphenation.md) | enforce attribute naming style in template |
| :wrench: | [vue/html-end-tags](./docs/rules/html-end-tags.md) | enforce end tag style |
| :wrench: | [vue/html-indent](./docs/rules/html-indent.md) | enforce consistent indentation in `<template>` |
| :wrench: | [vue/html-self-closing](./docs/rules/html-self-closing.md) | enforce self-closing style |
|  | [vue/max-attributes-per-line](./docs/rules/max-attributes-per-line.md) | enforce the maximum number of attributes per line |
| :wrench: | [vue/mustache-interpolation-spacing](./docs/rules/mustache-interpolation-spacing.md) | enforce unified spacing in mustache interpolations |
| :wrench: | [vue/name-property-casing](./docs/rules/name-property-casing.md) | enforce specific casing for the name property in Vue components |
| :wrench: | [vue/no-multi-spaces](./docs/rules/no-multi-spaces.md) | disallow multiple spaces |
|  | [vue/require-default-prop](./docs/rules/require-default-prop.md) | require default value for props |
|  | [vue/require-prop-types](./docs/rules/require-prop-types.md) | require type definitions in props |
| :wrench: | [vue/v-bind-style](./docs/rules/v-bind-style.md) | enforce `v-bind` directive style |
| :wrench: | [vue/v-on-style](./docs/rules/v-on-style.md) | enforce `v-on` directive style |

### Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

Enforce all the rules in this category, as well as all higher priority rules, with:

```json
{
  "extends": "plugin:vue/recommended"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [vue/html-quotes](./docs/rules/html-quotes.md) | enforce quotes style of HTML attributes |
|  | [vue/no-confusing-v-for-v-if](./docs/rules/no-confusing-v-for-v-if.md) | disallow confusing `v-for` and `v-if` on the same element |
|  | [vue/order-in-components](./docs/rules/order-in-components.md) | enforce order of properties in components |
|  | [vue/this-in-template](./docs/rules/this-in-template.md) | enforce usage of `this` in template |

### Uncategorized

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [vue/html-closing-bracket-newline](./docs/rules/html-closing-bracket-newline.md) | require or disallow a line break before tag's closing brackets |
| :wrench: | [vue/html-closing-bracket-spacing](./docs/rules/html-closing-bracket-spacing.md) | require or disallow a space before tag's closing brackets |
| :wrench: | [vue/script-indent](./docs/rules/script-indent.md) | enforce consistent indentation in `<script>` |

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

### Can my javascript code have increased indentation?

It depends on the version of eslint you're using.

[indent](https://eslint.org/docs/rules/indent) rule in `eslint@3.x` makes it possible, but if you use `eslint@4.x` be aware that this rule has been rewritten and is more strict now, thus it doesn't allow to have increased initial indentation.

You can however use [indent-legacy](https://eslint.org/docs/rules/indent-legacy) rule instead.
More informations [here](https://eslint.org/docs/user-guide/migrating-to-4.0.0#indent-rewrite).

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
