# User Guide

## 💿 Installation

Use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install.

```bash
npm install --save-dev eslint eslint-plugin-vue@next
```

::: tip Requirements
- ESLint v5.0.0 or later
- Node.js v6.5.0 or later
:::

## 📖 Usage

### Configuration

Create `.eslintrc.*` file to configure rules. See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring).

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

See [the rule list](../README.md) to get the `extends` &amp; `rules` that this plugin provides.

#### Use together with custom parsers

If you want to use custom parsers such as [babel-eslint](https://www.npmjs.com/package/babel-eslint) or [typescript-eslint-parser](https://www.npmjs.com/package/typescript-eslint-parser), you have to use `parserOptions.parser` option instead of `parser` option. Because this plugin requires [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser) to parse `.vue` files, so this plugin doesn't work if you overwrote `parser` option.

```diff
- "parser": "babel-eslint",
  "parserOptions": {
+     "parser": "babel-eslint",
      "sourceType": "module"
  }
```

### Command

You have to include the `.vue` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.vue src
eslint "src/**/*.{js,vue}"
```

### Editor integrations

#### Visual Studio Code

Use [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension that Microsoft provides officially.

You have to configure the `eslint.validate` option of the extension to check `.vue` files because the extension targets only `*.js` or `*.jsx` files by default.

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

### The code of components

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

### `<!-- eslint-disable -->`

You can use `<!-- eslint-disable -->`-like HTML comments in `<template>` of `.vue` files to disable a certain rule temporarily.

For example:

```vue
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4">
  </div>
</template>
```

If you want to disallow `eslint-disable` functionality in `<template>`, disable [vue/comment-directive](../rules/comment-directive.md) rule.

## ❓ FAQ

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

See also: "[Use together with custom parsers](#use-together-with-custom-parsers)" section.

### Why doesn't it work on .vue file?

1. Make sure you don't have `eslint-plugin-html` in your config. The `eslint-plugin-html` extracts the content from `<script>` tags, but `eslint-plugin-vue` requires `<script>` tags and `<template>` tags in order to distinguish template and script in single file components.

    ```diff
      "plugins": [
        "vue",
    -   "html"
      ]
    ```

2. Make sure your tool is set to lint `.vue` files.
    - CLI targets only `.js` files by default. You have to specify additional extensions by `--ext` option or glob patterns. E.g. `eslint "src/**/*.{js,vue}"` or `eslint src --ext .vue`. If you use `@vue/cli-plugin-eslint` and the `vue-cli-service lint` command - you don't have to worry about it.
    - VSCode targets only JavaScript or HTML files by default. You have to add `"vue"` to the `"eslint.validate"` array in vscode settings. e.g. `"eslint.validate": [ "javascript", "javascriptreact", "vue" ]`
    - If you use `Vetur` plugin in VSCode - set `"vetur.validation.template": false` to avoid default Vetur template validation. Check out [vetur documentation](https://github.com/vuejs/vetur/blob/master/docs/linting-error.md) for more info.
    - For Atom editor, you need to go into Settings -> Packages -> linter-eslint, under the option “List of scopes to run eslint on”, add `text.html.vue`.
    - For Sublime Text, you need to open command-pallete via cmd+shift+p (cmd => ctrl for windows) and type "Preferences: SublimeLinter Settings", paste to the config on the right side:
      ```json
      {
        "linters": {
          "eslint": {
            "selector": "source.js, text.html.vue"
          }
        }
      }
      ```
 
## 🚥 Versioning policy

This plugin is following [Semantic Versioning](https://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## 📰 Changelog

We are using [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases).

## 🔒 License

See the [LICENSE](https://github.com/vuejs/eslint-plugin-vue/blob/master/LICENSE) file for license rights and limitations (MIT).
