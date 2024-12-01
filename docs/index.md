---
sidebarDepth: 0
---

# Introduction

Official ESLint plugin for Vue.js.

This plugin allows us to check the `<template>` and `<script>` of `.vue` files with ESLint, as well as Vue code in `.js` files.

- Finds syntax errors.
- Finds the wrong use of [Vue.js Directives](https://vuejs.org/api/built-in-directives.html).
- Finds the violation for [Vue.js Style Guide](https://vuejs.org/style-guide/).

ESLint editor integrations are useful to check your code in real-time.

## :traffic_light: Versioning policy

This plugin follows [Semantic Versioning].
However, please note that we do not follow [ESLint's Semantic Versioning Policy].
In minor version releases, this plugin may change the sharable configs provided by the plugin or the default behavior of the plugin's rules in order to add features to the plugin. Because we want to add many features to the plugin soon, so that users can easily take advantage of new features in Vue and Nuxt.

According to our policy, any minor update may report more linting errors than the previous release. As such, we recommend using the [tilde (`~`)](https://semver.npmjs.com/#syntax-examples) in `package.json` to guarantee the results of your builds.

[Semantic Versioning]: https://semver.org/
[ESLint's Semantic Versioning Policy]: https://github.com/eslint/eslint#semantic-versioning-policy

## :newspaper: Changelog

We are using [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases).

## :lock: License

See the [LICENSE](https://github.com/vuejs/eslint-plugin-vue/blob/master/LICENSE) file for license rights and limitations (MIT).
