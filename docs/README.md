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

:::warning Status of Vue.js 3.x supports
This plugin supports the basic syntax of Vue.js 3.2, `<script setup>`, and CSS variable injection, but the ref sugar, an experimental feature of Vue.js 3.2, is not yet supported.  
If you have issues with these, please also refer to the [FAQ](./user-guide/README.md#does-not-work-well-with-script-setup). If you can't find a solution, search for the issue and if the issue doesn't exist, open a new issue.
:::

## :traffic_light: Versioning policy

This plugin is following [Semantic Versioning](https://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## :newspaper: Changelog

We are using [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases).

## :lock: License

See the [LICENSE](https://github.com/vuejs/eslint-plugin-vue/blob/master/LICENSE) file for license rights and limitations (MIT).
