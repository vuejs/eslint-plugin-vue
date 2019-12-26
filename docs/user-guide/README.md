# User Guide

## :cd: Installation

Via `vue-cli` (**Recommended**):
```bash
vue add @vue/cli-plugin-eslint
```

Via [npm](https://www.npmjs.com/):
```bash
npm install --save-dev eslint eslint-plugin-vue
```

Via [yarn](https://yarnpkg.com/):
```bash
yarn add -D eslint eslint-plugin-vue
```

::: tip Requirements
- ESLint v6.0.0 and above
- Node.js v8.10.0 and above
:::

## :book: Usage

### Configuration

Use `.eslintrc.*` file to configure rules. See also: [https://eslint.org/docs/user-guide/configuring](https://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
```

See [the rule list](../rules/README.md) to get the `extends` &amp; `rules` that this plugin provides.

:::warning Reporting rules
By default all rules from **base** and **essential** categories report ESLint errors. Other rules - because they're not covering potential bugs in the application - report warnings. What does it mean? By default - nothing, but if you want - you can set up a treshold and break the build after a certain amount of warnings, instead of any. More information [here](https://eslint.org/docs/user-guide/command-line-interface#handling-warnings).
:::

### Running ESLint from the command line

If you want to run `eslint` from the command line, make sure you include the `.vue` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern, because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.vue src
eslint "src/**/*.{js,vue}"
```

::: tip
If you installed [@vue/cli-plugin-eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint) you should have `lint` script added in your `package.json`. That means you can just run `yarn lint` or `npm run lint`.
:::

#### How to use a custom parser?

If you want to use custom parsers such as [babel-eslint](https://www.npmjs.com/package/babel-eslint) or [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser), you have to use the `parserOptions.parser` option instead of the `parser` option. Because this plugin requires [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser) to parse `.vue` files, this plugin doesn't work if you overwrite the `parser` option.

```diff
- "parser": "babel-eslint",
+ "parser": "vue-eslint-parser",
  "parserOptions": {
+     "parser": "babel-eslint",
      "sourceType": "module"
  }
```

### How does ESLint detect components?

All component-related rules are applied to code that passes any of the following checks:

* `Vue.component()` expression
* `Vue.extend()` expression
* `Vue.mixin()` expression
* `export default {}` in `.vue` or `.jsx` file

However, if you want to take advantage of the rules in any of your custom objects that are Vue components, you might need to use the special comment `// @vue/component` that marks an object in the next line as a Vue component in any file, e.g.:

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

### Disabling rules via `<!-- eslint-disable -->`

You can use `<!-- eslint-disable -->`-like HTML comments in the `<template>` of `.vue` files to disable a certain rule temporarily.

For example:

```vue
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4">
  </div>
</template>
```

If you want to disallow `eslint-disable` functionality in `<template>`, disable the [vue/comment-directive](../rules/comment-directive.md) rule.

## :computer: Editor integrations

#### Visual Studio Code

Use the [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension that Microsoft provides officially.

You have to configure the `eslint.validate` option of the extension to check `.vue` files, because the extension targets only `*.js` or `*.jsx` files by default.

Example **.vscode/settings.json**:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "vue", "autoFix": true }
  ]
}
```

If you use the `Vetur` plugin, set `"vetur.validation.template": false` to avoid default Vetur template validation. Check out [vetur documentation](https://vuejs.github.io/vetur/linting-error.html) for more info.

#### Sublime Text

Use Package Control to install **SublimeLinter** and its ESLint extension **[SublimeLinter-eslint](https://github.com/SublimeLinter/SublimeLinter-eslint)**.

In the menu go to `Preferences > Package Settings > SublimeLinter > Settings` and paste in this:

```json
{
  "linters": {
    "eslint": {
      "selector": "text.html.vue, source.js - meta.attribute-with-value"
    }
  }
}
```

#### Atom editor

Go into `Settings -> Packages -> linter-eslint`, under the option "List of scopes to run eslint on", add `text.html.vue`. You may need to restart Atom.

#### IntelliJ IDEA / JetBrains WebStorm

In the **Settings/Preferences** dialog (`Cmd+,`/`Ctrl+Alt+S`), choose JavaScript under **Languages and Frameworks** and then choose **ESLint** under **Code Quality Tools**.
On the **ESLint page** that opens, select the *Enable* checkbox.

If your ESLint configuration is updated (manually or from your version control), open it in the editor and choose **Apply ESLint Code Style Rules** in the context menu.

read more: [JetBrains - ESLint](https://www.jetbrains.com/help/idea/eslint.html)

## :question: FAQ

### What is the "Use the latest vue-eslint-parser" error?

Most `eslint-plugin-vue` rules require `vue-eslint-parser` to check `<template>` ASTs.

Make sure you have one of the following settings in your **.eslintrc**:

- `"extends": ["plugin:vue/recommended"]`
- `"extends": ["plugin:vue/base"]`

If you already use another parser (e.g. `"parser": "babel-eslint"`), please move it into `parserOptions`, so it doesn't collide with the `vue-eslint-parser` used by this plugin's configuration:

```diff
- "parser": "babel-eslint",
  "parser": "vue-eslint-parser",
  "parserOptions": {
+     "parser": "babel-eslint",
      "ecmaVersion": 2017,
      "sourceType": "module"
  }
```

See also: "[Use together with custom parsers](#use-together-with-custom-parsers)" section.

### Why doesn't it work on .vue files?

1. Make sure you don't have `eslint-plugin-html` in your config. The `eslint-plugin-html` extracts the content from `<script>` tags, but `eslint-plugin-vue` requires `<script>` tags and `<template>` tags in order to distinguish template and script in single file components.

  ```diff
    "plugins": [
      "vue",
  -   "html"
    ]
  ```

2. Make sure your tool is set to lint `.vue` files.
  - CLI targets only `.js` files by default. You have to specify additional extensions with the `--ext` option or glob patterns. E.g. `eslint "src/**/*.{js,vue}"` or `eslint src --ext .vue`. If you use `@vue/cli-plugin-eslint` and the `vue-cli-service lint` command - you don't have to worry about it.
  - If you are having issues with configuring editor, please read [editor integrations](#editor-integrations)
