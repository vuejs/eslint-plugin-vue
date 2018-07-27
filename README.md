# eslint-plugin-vue

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![CircleCI](https://circleci.com/gh/vuejs/eslint-plugin-vue.svg?style=svg)](https://circleci.com/gh/vuejs/eslint-plugin-vue)

> Official ESLint plugin for Vue.js

## :exclamation: Attention - this is documentation for version `5.x` :exclamation:

This branch contains `eslint-plugin-vue@next` which is a pre-released `5.0`, but it's not the default version that you get with `npm install eslint-plugin-vue`. In order to install this you need to specify either `"eslint-plugin-vue": "next"` in `package.json` or do `npm install eslint-plugin-vue@next`.

Please try it and report any issues that you might have encountered.

If you want to check previous releases [go here](https://github.com/vuejs/eslint-plugin-vue/releases).

## :art: Playground on the Web

You can try this plugin on the Web.

- https://mysticatea.github.io/vue-eslint-demo/

## :grey_exclamation: Requirements

- [ESLint](http://eslint.org/) `^5.0.0`.
- Node.js `>=6.5.0`

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-vue@next
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

### Single File Components

ESLint only targets `.js` files by default. You must include the `.vue` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern.

Examples:

```bash
eslint --ext .js,.vue src
eslint src/**/*.{js,vue}
```

### Attention

All component-related rules are being applied to code that passes any of the following checks:

* `Vue.component()` expression
* `Vue.extend()` expression
* `Vue.mixin()` expression
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

This plugin provides four predefined configs:
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
| :wrench: | [vue/attribute-hyphenation](./docs/rules/attribute-hyphenation.md) | enforce attribute naming style on custom components in template |
| :wrench: | [vue/component-name-in-template-casing](./docs/rules/component-name-in-template-casing.md) | enforce specific casing for the component naming style in template |
| :wrench: | [vue/html-closing-bracket-newline](./docs/rules/html-closing-bracket-newline.md) | require or disallow a line break before tag's closing brackets |
| :wrench: | [vue/html-closing-bracket-spacing](./docs/rules/html-closing-bracket-spacing.md) | require or disallow a space before tag's closing brackets |
| :wrench: | [vue/html-end-tags](./docs/rules/html-end-tags.md) | enforce end tag style |
| :wrench: | [vue/html-indent](./docs/rules/html-indent.md) | enforce consistent indentation in `<template>` |
| :wrench: | [vue/html-self-closing](./docs/rules/html-self-closing.md) | enforce self-closing style |
| :wrench: | [vue/max-attributes-per-line](./docs/rules/max-attributes-per-line.md) | enforce the maximum number of attributes per line |
| :wrench: | [vue/mustache-interpolation-spacing](./docs/rules/mustache-interpolation-spacing.md) | enforce unified spacing in mustache interpolations |
| :wrench: | [vue/name-property-casing](./docs/rules/name-property-casing.md) | enforce specific casing for the name property in Vue components |
| :wrench: | [vue/no-multi-spaces](./docs/rules/no-multi-spaces.md) | disallow multiple spaces |
| :wrench: | [vue/prop-name-casing](./docs/rules/prop-name-casing.md) | enforce specific casing for the Prop name in Vue components |
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
| :wrench: | [vue/attributes-order](./docs/rules/attributes-order.md) | enforce order of attributes |
| :wrench: | [vue/html-quotes](./docs/rules/html-quotes.md) | enforce quotes style of HTML attributes |
|  | [vue/no-use-v-if-with-v-for](./docs/rules/no-use-v-if-with-v-for.md) | disallow use v-if on the same element as v-for |
|  | [vue/no-v-html](./docs/rules/no-v-html.md) | disallow use of v-html to prevent XSS attack |
| :wrench: | [vue/order-in-components](./docs/rules/order-in-components.md) | enforce order of properties in components |
|  | [vue/this-in-template](./docs/rules/this-in-template.md) | enforce usage of `this` in template |

### Uncategorized

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [vue/script-indent](./docs/rules/script-indent.md) | enforce consistent indentation in `<script>` |

### Deprecated

> - :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
> - :innocent: We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
| [vue/no-confusing-v-for-v-if](./docs/rules/no-confusing-v-for-v-if.md) | [vue/no-use-v-if-with-v-for](./docs/rules/no-use-v-if-with-v-for.md) |

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

### Why doesn't it work on .vue file?

1. Make sure you don't have `eslint-plugin-html` in your config. The `eslint-plugin-html` extracts the content from `<script>` tags, but `eslint-plugin-vue` requires `<script>` tags and `<template>` tags in order to distinguish template and script in single file components.

  ```diff
    "plugins": [
      "vue",
  -   "html"
    ]
  ```

2. Make sure your tool is set to lint `.vue` files.
  - CLI targets only `.js` files by default. You have to specify additional extensions by `--ext` option or glob patterns. E.g. `eslint "src/**/*.{js,vue}"` or `eslint src --ext .vue`.
  - VSCode targets only JavaScript or HTML files by default. You have to add `"vue"` to the `"eslint.validate"` array in vscode settings. e.g. `"eslint.validate": [ "javascript", "javascriptreact", "vue" ]`

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

### Working with rules

Before you start writing new rule, please read the [official ESLint guide](https://eslint.org/docs/developer-guide/working-with-rules).

Next in order to get an idea how does the AST of the code that you want to check looks like, you can use one of the following applications:
- [astexplorer.net](http://astexplorer.net/) - best tool to inspect ASTs, but it doesn't support Vue templates yet
- [ast.js.org](https://ast.js.org/) - not fully featured, but supports Vue templates syntax

Since single file components in Vue are not plain JavaScript, we can't use the default parser, and we had to introduce additional one: `vue-eslint-parser`, that generates enhanced AST with nodes that represent specific parts of the template syntax, as well as what's inside the `<script>` tag.

To know more about certain nodes in produced ASTs, go here:
- [ESTree docs](https://github.com/estree/estree)
- [vue-eslint-parser AST docs](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md)

The `vue-eslint-parser` provides few useful parser services, to help traverse the produced AST and access tokens of the template:
- `context.parserServices.defineTemplateBodyVisitor(visitor, scriptVisitor)`
- `context.parserServices.getTemplateBodyTokenStore()`

Check out an [example rule](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/mustache-interpolation-spacing.js) to get a better understanding of how these work.

Please be aware that regarding what kind of code examples you'll write in tests, you'll have to accordingly setup the parser in `RuleTester` (you can do it on per test case basis though). [See an example here](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attribute-hyphenation.js#L19)

If you'll stuck, remember there are plenty of rules you can learn from already, and if you can't find the right solution - don't hesitate to reach out in issues. We're happy to help!

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
