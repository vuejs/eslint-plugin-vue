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

- ESLint v6.2.0 and above
- Node.js v8.10.0 and above

We have started supporting ESLint v8.0.0 beta, but note that beta support will be dropped once the stable version is released.

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
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
```

See [the rule list](../rules/README.md) to get the `extends` &amp; `rules` that this plugin provides.

#### Bundle Configurations

This plugin provides some predefined configs.
You can use the following configs by adding them to `extends`.

- `"plugin:vue/base"` ... Settings and rules to enable correct ESLint parsing.
- Configurations for using Vue.js 3.x.
  - `"plugin:vue/vue3-essential"` ... `base`, plus rules to prevent errors or unintended behavior.
  - `"plugin:vue/vue3-strongly-recommended"` ... Above, plus rules to considerably improve code readability and/or dev experience.
  - `"plugin:vue/vue3-recommended"` ... Above, plus rules to enforce subjective community defaults to ensure consistency.
- Configurations for using Vue.js 2.x.
  - `"plugin:vue/essential"` ... `base`, plus rules to prevent errors or unintended behavior.
  - `"plugin:vue/strongly-recommended"` ... Above, plus rules to considerably improve code readability and/or dev experience.
  - `"plugin:vue/recommended"` ... Above, plus rules to enforce subjective community defaults to ensure consistency

:::warning Reporting rules
By default all rules from **base** and **essential** categories report ESLint errors. Other rules - because they're not covering potential bugs in the application - report warnings. What does it mean? By default - nothing, but if you want - you can set up a threshold and break the build after a certain amount of warnings, instead of any. More information [here](https://eslint.org/docs/user-guide/command-line-interface#handling-warnings).
:::

:::warning Status of Vue.js 3.x supports
This plugin supports the basic syntax of Vue.js 3.2, `<script setup>`, and CSS variable injection, but the ref sugar, an experimental feature of Vue.js 3.2, is not yet supported.  
If you have issues with these, please also refer to the [FAQ](#does-not-work-well-with-script-setup). If you can't find a solution, search for the issue and if the issue doesn't exist, open a new issue.
:::

### Running ESLint from the command line

If you want to run `eslint` from the command line, make sure you include the `.vue` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-target-files-to-lint) or a glob pattern, because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.vue src
eslint "src/**/*.{js,vue}"
```

::: tip
If you installed [@vue/cli-plugin-eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint), you should have the `lint` script added to your `package.json`. That means you can just run `yarn lint` or `npm run lint`.
:::

### How to use a custom parser?

If you want to use custom parsers such as [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) or [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser), you have to use the `parserOptions.parser` option instead of the `parser` option. Because this plugin requires [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser) to parse `.vue` files, this plugin doesn't work if you overwrite the `parser` option.

```diff
- "parser": "@typescript-eslint/parser",
+ "parser": "vue-eslint-parser",
  "parserOptions": {
+     "parser": "@typescript-eslint/parser",
      "sourceType": "module"
  }
```

The `parserOptions.parser` option can also specify an object to specify multiple parsers. See [vue-eslint-parser README](https://github.com/vuejs/vue-eslint-parser#readme) for more details.

### How does ESLint detect components?

All component-related rules are applied to code that passes any of the following checks:

- `Vue.component()` expression
- `Vue.extend()` expression
- `Vue.mixin()` expression
- `app.component()` expression
- `app.mixin()` expression
- `createApp()` expression
- `defineComponent()` expression
- `export default {}` in `.vue` or `.jsx` file

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

You can use `<!-- eslint-disable -->`-like HTML comments in the `<template>` and in the block level of `.vue` files to disable a certain rule temporarily.

For example:

```vue
<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div a="1" b="2" c="3" d="4">
  </div>
</template>
```

If you want to disallow `eslint-disable` functionality in `<template>`, disable the [vue/comment-directive](../rules/comment-directive.md) rule.

### Parser Options

This plugin uses [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser).
For `parserOptions`, you can use the `vueFeatures` options of `vue-eslint-parser`.

```json
{
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "vueFeatures": {
      "filter": true,
      "interpolationAsNonHTML": false,
    }
  }
}
```

See the [`parserOptions.vueFeatures` documentation for `vue-eslint-parser`](https://github.com/vuejs/vue-eslint-parser#parseroptionsvuefeatures) for more details.

## :computer: Editor integrations

### Visual Studio Code

Use the [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension that Microsoft provides officially.

You have to configure the `eslint.validate` option of the extension to check `.vue` files, because the extension targets only `*.js` or `*.jsx` files by default.

Example **.vscode/settings.json**:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue"
  ]
}
```

If you use the `Vetur` plugin, set `"vetur.validation.template": false` to avoid default Vetur template validation. Check out [vetur documentation](https://vuejs.github.io/vetur/guide/linting-error.html#linting) for more info.

### Sublime Text

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

### Atom editor

Go into `Settings -> Packages -> linter-eslint`, under the option "List of scopes to run eslint on", add `text.html.vue`. You may need to restart Atom.

### IntelliJ IDEA / JetBrains WebStorm

In the **Settings/Preferences** dialog (`Cmd+,`/`Ctrl+Alt+S`), choose JavaScript under **Languages and Frameworks** and then choose **ESLint** under **Code Quality Tools**.
On the **ESLint page** that opens, select the *Enable* checkbox.

If your ESLint configuration is updated (manually or from your version control), open it in the editor and choose **Apply ESLint Code Style Rules** in the context menu.

read more: [JetBrains - ESLint](https://www.jetbrains.com/help/idea/eslint.html)

## :question: FAQ

### What is the "Use the latest vue-eslint-parser" error?

Most `eslint-plugin-vue` rules require `vue-eslint-parser` to check `<template>` ASTs.

Make sure you have one of the following settings in your **.eslintrc**:

- `"extends": ["plugin:vue/vue3-recommended"]`
- `"extends": ["plugin:vue/base"]`

If you already use another parser (e.g. `"parser": "@typescript-eslint/parser"`), please move it into `parserOptions`, so it doesn't collide with the `vue-eslint-parser` used by this plugin's configuration:

```diff
- "parser": "@typescript-eslint/parser",
+ "parser": "vue-eslint-parser",
  "parserOptions": {
+     "parser": "@typescript-eslint/parser",
      "ecmaVersion": 2020,
      "sourceType": "module"
  }
```

See also: "[How to use a custom parser?](#how-to-use-a-custom-parser)" section.

### Why doesn't it work on .vue files?

1. Make sure you don't have `eslint-plugin-html` in your config. The `eslint-plugin-html` extracts the content from `<script>` tags, but `eslint-plugin-vue` requires `<script>` tags and `<template>` tags in order to distinguish template and script in single file components.

  ```diff
    "plugins": [
      "vue",
  -   "html"
    ]
  ```

1. Make sure your tool is set to lint `.vue` files.

    - CLI targets only `.js` files by default. You have to specify additional extensions with the `--ext` option or glob patterns. E.g. `eslint "src/**/*.{js,vue}"` or `eslint src --ext .vue`. If you use `@vue/cli-plugin-eslint` and the `vue-cli-service lint` command - you don't have to worry about it.
    - If you are having issues with configuring editor, please read [editor integrations](#editor-integrations)

### Conflict with [Prettier]

Use [eslint-config-prettier] for [Prettier] not to conflict with the shareable config provided by this plugin.

Example **.eslintrc.js**:

```js
module.exports = {
  // ...
  extends: [
    // ...
    // 'eslint:recommended',
    // ...
    'plugin:vue/vue3-recommended',
    // ...
    "prettier"
    // Make sure "prettier" is the last element in this list.
  ],
  // ...
}
```

If Prettier conflicts with a rule you have set, [turn off that rule][prettier-linters]. For example, if you have `vue/html-indent` configured as `error` in `rules`, but it conflicts with Prettier, remove that line:

```diff
module.exports = {
  // ...
  rules: {
    // ...
-    "vue/html-indent": "error",
    // ...
  },
  // ...
}
```

[prettier]: https://prettier.io/
[prettier-linters]: https://prettier.io/docs/en/integrating-with-linters.html
[eslint-config-prettier]: https://github.com/prettier/eslint-config-prettier

### Using JSX

If you are using JSX, you need to enable JSX in your ESLint configuration.

```diff
  "parserOptions": {
      "ecmaVersion": 2020,
      "ecmaFeatures": {
+         "jsx": true
      }
  }
```

See also [ESLint - Specifying Parser Options](https://eslint.org/docs/user-guide/configuring#specifying-parser-options).

The same configuration is required when using JSX with TypeScript (TSX) in the `.vue` file.  
See also [here](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md#parseroptionsecmafeaturesjsx).  
Note that you cannot use angle-bracket type assertion style (`var x = <foo>bar;`) when using `jsx: true`.

### Trouble with Visual Studio Code

- Turning off the rule in the ESLint configuration file does not ignore the warning.
- Using the `<!-- eslint-disable -->` comment does not suppress warnings.
- Duplicate warnings are displayed.
- Used `@babel/eslint-parser`, but the template still show `vue/no-parsing-error` warnings.

You need to turn off Vetur's template validation by adding `vetur.validation.template: false` to your `.vscode/settings.json`.

See also: "[Visual Studio Code](#editor-integrations)" section and [Vetur - Linting](https://vuejs.github.io/vetur/guide/linting-error.html#linting).

### Does not work well with `<script setup>`

#### The variables used in the `<template>` are warned by `no-unused-vars` rule

You must use [vue/script-setup-uses-vars](../rules/script-setup-uses-vars.md) rule.  
In your configuration, use the rule set provided by `eslint-plugin-vue` or enable it rule.

Example **.eslintrc.js**:

```js
module.exports = {
  // Use the rule set.
  extends: ['plugin:vue/base'],
  rules: {
    // Enable vue/script-setup-uses-vars rule
    'vue/script-setup-uses-vars': 'error',
  }
}
```

#### Compiler macros such as `defineProps` and `defineEmits` are warned by `no-undef` rule

You need to define [global variables](https://eslint.org/docs/user-guide/configuring/language-options#using-configuration-files-1) in your ESLint configuration file.  
If you don't want to define global variables, use `import { defineProps, defineEmits } from 'vue'`.

Example **.eslintrc.js**:

```js
module.exports = {
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  }
}
```

See also [ESLint - Specifying Globals > Using configuration files](https://eslint.org/docs/user-guide/configuring/language-options#using-configuration-files-1).

#### Parsing error with Top Level `await`

##### Using ESLint <= v7.x

The parser `espree` that comes with `ESLint` v7.x doesn't understand the syntax of ES2022, so it can't parse the Top Level `await` either.  
However, `espree` >= v8 can understand the syntax of ES2022 and parse the Top Level `await`.  
You install `espree` >= v8 and specify `"espree"` and ES2022 in your configuration, the parser will be able to parse it.

```js
module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'espree', // <-
    ecmaVersion: 2022, // <-
    sourceType: 'module'
  },
}
```

However, note that the AST generated by `espree` v8+ may not work well with some rules of `ESLint` v7.x.

##### Using ESLint >= v8.x

You need to specify `2022` or `"latest"` for `parserOptions.ecmaVersion`.

```js
module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
}
```

#### Other Problems

Try searching for existing issues.
If it does not exist, you should open a new issue and share your repository to reproduce the issue.
