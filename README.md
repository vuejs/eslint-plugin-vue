# eslint-plugin-vue

> Official ESLint plugin for Vue.js

## 💿 Installation

Use [npm](https://www.npmjs.com/).

```
> npm install --save-dev eslint eslint-plugin-vue
```

- Requires Node.js `^4.0.0 || >=6.0.0`
- Requires ESLint `>=3.18.0`

## 📖 Usage

Write `.eslintrc.*` file to configure rules. See also: http://eslint.org/docs/user-guide/configuring

**.eslintrc.json** (An example)

```json
{
    "plugins": ["vue"],
    "extends": ["eslint:recommended", "plugin:vue/recommended"],
    "rules": {
        "vue/html-quotes": ["error", "double"],
        "vue/v-bind-style": ["error", "shorthand"],
        "vue/v-on-style": ["error", "shorthand"]
    }
}
```

## 💡 Rules

- ⭐️ the mark of a recommended rule.
- ✒️ the mark of a fixable rule.

<!--RULES_TABLE_START-->
### Possible Errors

|    | Rule ID | Description |
|:---|:--------|:------------|
| ⭐️ | [no-invalid-template-root](./docs/rules/no-invalid-template-root.md) | disallow invalid template root. |
| ⭐️ | [no-invalid-v-bind](./docs/rules/no-invalid-v-bind.md) | disallow invalid v-bind directives. |
| ⭐️ | [no-invalid-v-cloak](./docs/rules/no-invalid-v-cloak.md) | disallow invalid v-cloak directives. |
| ⭐️ | [no-invalid-v-else-if](./docs/rules/no-invalid-v-else-if.md) | disallow invalid v-else-if directives. |
| ⭐️ | [no-invalid-v-else](./docs/rules/no-invalid-v-else.md) | disallow invalid v-else directives. |
| ⭐️ | [no-invalid-v-for](./docs/rules/no-invalid-v-for.md) | disallow invalid v-for directives. |
| ⭐️ | [no-invalid-v-html](./docs/rules/no-invalid-v-html.md) | disallow invalid v-html directives. |
| ⭐️ | [no-invalid-v-if](./docs/rules/no-invalid-v-if.md) | disallow invalid v-if directives. |
| ⭐️ | [no-invalid-v-model](./docs/rules/no-invalid-v-model.md) | disallow invalid v-model directives. |
| ⭐️ | [no-invalid-v-on](./docs/rules/no-invalid-v-on.md) | disallow invalid v-on directives. |
| ⭐️ | [no-invalid-v-once](./docs/rules/no-invalid-v-once.md) | disallow invalid v-once directives. |
| ⭐️ | [no-invalid-v-pre](./docs/rules/no-invalid-v-pre.md) | disallow invalid v-pre directives. |
| ⭐️ | [no-invalid-v-show](./docs/rules/no-invalid-v-show.md) | disallow invalid v-show directives. |
| ⭐️ | [no-invalid-v-text](./docs/rules/no-invalid-v-text.md) | disallow invalid v-text directives. |
| ⭐️ | [no-parsing-error](./docs/rules/no-parsing-error.md) | disallow parsing errors in `<template>`. |

### Best Practices

|    | Rule ID | Description |
|:---|:--------|:------------|
| ⭐️✒️ | [html-end-tags](./docs/rules/html-end-tags.md) | enforce end tag style. |
| ⭐️✒️ | [html-no-self-closing](./docs/rules/html-no-self-closing.md) | disallow self-closing elements. |
| ⭐️ | [no-confusing-v-for-v-if](./docs/rules/no-confusing-v-for-v-if.md) | disallow confusing `v-for` and `v-if` on the same element. |
| ⭐️ | [no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md) | disallow duplicate arguments. |
| ⭐️ | [no-textarea-mustache](./docs/rules/no-textarea-mustache.md) | disallow mustaches in `<textarea>`. |
| ⭐️ | [require-component-is](./docs/rules/require-component-is.md) | require `v-bind:is` of `<component>` elements. |
| ⭐️ | [require-v-for-key](./docs/rules/require-v-for-key.md) | require `v-bind:key` with `v-for` directives. |

### Stylistic Issues

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [html-quotes](./docs/rules/html-quotes.md) | enforce quotes style of HTML attributes. |
| ✒️ | [v-bind-style](./docs/rules/v-bind-style.md) | enforce v-bind directive style. |
| ✒️ | [v-on-style](./docs/rules/v-on-style.md) | enforce v-on directive style. |

<!--RULES_TABLE_END-->

## ⚙ Configs

This plugin provides `plugin:vue/recommended` preset config.
This preset config:

- adds `parser: "vue-eslint-parser"`
- enables rules which are given ⭐️ in the above table.

## ⚓️ Semantic Versioning Policy

`eslint-plugin-vue` follows [semantic versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

- Patch release (intended to not break your lint build)
    - A bug fix in a rule that results in it reporting fewer errors.
    - Improvements to documentation.
    - Non-user-facing changes such as refactoring code, adding, deleting, or modifying tests, and increasing test coverage.
    - Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone).
- Minor release (might break your lint build)
    - A bug fix in a rule that results in it reporting more errors.
    - A new rule is created.
    - A new option to an existing rule is created.
    - An existing rule is deprecated.
- Major release (likely to break your lint build)
    - A support for old Node version is dropped.
    - A support for old ESLint version is dropped.
    - An existing rule is changed in it reporting more errors.
    - An existing rule is removed.
    - An existing option of a rule is removed.
    - An existing config is updated.

## 📰 Changelog

- [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases)

## 💎 Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### Development Tools

- `npm test` runs tests and measures coverage.
- `npm run coverage` shows the coverage result of `npm test` command.
- `npm run clean` removes the coverage result of `npm test` command.
