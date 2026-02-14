# eslint-plugin-vue

## 10.8.0

### Minor Changes

- Added more `Promise` functions to [`vue/no-async-in-computed-properties`](https://eslint.vuejs.org/rules/no-async-in-computed-properties.html) ([#3020](https://github.com/vuejs/eslint-plugin-vue/pull/3020))

- Added `ignoreVBindObject` option to [`vue/attributes-order`](https://eslint.vuejs.org/rules/attributes-order.html) ([#3012](https://github.com/vuejs/eslint-plugin-vue/pull/3012))

- Added `allowEmptyAlias` option to [`vue/valid-v-for`](https://eslint.vuejs.org/rules/valid-v-for.html) ([#3011](https://github.com/vuejs/eslint-plugin-vue/pull/3011))

- Added [ESLint v10](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) as an allowed peer dependency (needs [`eslint-parser-vue` v10.3.0](https://github.com/vuejs/vue-eslint-parser/releases/tag/v10.3.0)) ([#2962](https://github.com/vuejs/eslint-plugin-vue/pull/2962))

- Added new `destructure: "only-when-assigned"` option to [`vue/define-props-destructuring`](https://eslint.vuejs.org/rules/define-props-destructuring.html) and changed default value from `destructure: "always"` to `destructure: "only-when-assigned"` ([#3009](https://github.com/vuejs/eslint-plugin-vue/pull/3009))

### Patch Changes

- Fixed [`vue/no-unused-vars`](https://eslint.vuejs.org/rules/no-unused-vars.html) to detect components passed as slot props ([#3008](https://github.com/vuejs/eslint-plugin-vue/pull/3008))

## 10.7.0

### Minor Changes

- Added [new `-error` config variants](https://eslint.vuejs.org/user-guide/#bundle-configurations-eslint-config-js), with all rules' severity set to `error`: `strongly-recommended-error`, `recommended-error`, `vue2-strongly-recommended-error`, `vue2-recommended-error` (along with their flat config equivalents) ([#2796](https://github.com/vuejs/eslint-plugin-vue/pull/2796))
- Added new [`vue/no-literals-in-template`](https://eslint.vuejs.org/rules/no-literals-in-template.html) rule ([#3000](https://github.com/vuejs/eslint-plugin-vue/pull/3000))
- Added new [`vue/no-undef-directives`](https://eslint.vuejs.org/rules/no-undef-directives.html) rule ([#2990](https://github.com/vuejs/eslint-plugin-vue/pull/2990))
- Added new `ignoreEOLComments` option to [`vue/no-multi-spaces`](https://eslint.vuejs.org/rules/no-multi-spaces.html) rule ([#2989](https://github.com/vuejs/eslint-plugin-vue/pull/2989))
- Changed [`vue/no-negated-v-if-condition`](https://eslint.vuejs.org/rules/no-negated-v-if-condition.html) suggestion to autofix ([#2984](https://github.com/vuejs/eslint-plugin-vue/pull/2984))
- Added TypeScript support for eslint-plugin-vue development ([#2916](https://github.com/vuejs/eslint-plugin-vue/pull/2916))

### Patch Changes

- Fixed false positives in [`vue/define-props-destructuring`](https://eslint.vuejs.org/rules/define-props-destructuring.html) rule when imported types are passed to `defineProps` ([#2995](https://github.com/vuejs/eslint-plugin-vue/pull/2995))
- Updated Vue 3 export names resources: added `DirectiveModifiers` ([#2996](https://github.com/vuejs/eslint-plugin-vue/pull/2996))
- Updated Vue 3 export names resources: added `nodeOps` and `patchProp` ([#2986](https://github.com/vuejs/eslint-plugin-vue/pull/2986))

## 10.6.2

### Patch Changes

- Fixed false positives in non-intersecting conditions in [`vue/no-duplicate-class-names`](https://eslint.vuejs.org/rules/no-duplicate-class-names.html) and correctly detect duplicates in combining expressions ([#2980](https://github.com/vuejs/eslint-plugin-vue/pull/2980))
- Fixed false positives for `TSImportType` in [`vue/script-indent`](https://eslint.vuejs.org/rules/script-indent.html) rule ([#2969](https://github.com/vuejs/eslint-plugin-vue/pull/2969))
- Improved performance and type safety in [`vue/prefer-use-template-ref`](https://eslint.vuejs.org/rules/prefer-use-template-ref.html) ([#2982](https://github.com/vuejs/eslint-plugin-vue/pull/2982))

## 10.6.1

### Patch Changes

- Fixed false positives for comments outside `<template>` in [`vue/no-multiple-template-root`](https://eslint.vuejs.org/rules/no-multiple-template-root.html) rule ([#2964](https://github.com/vuejs/eslint-plugin-vue/pull/2964))

## 10.6.0

### Minor Changes

- Updated [`vue/no-import-compiler-macros`](https://eslint.vuejs.org/rules/no-import-compiler-macros.html) to clarify that macros are not allowed outside `<script setup>` ([#2938](https://github.com/vuejs/eslint-plugin-vue/pull/2938))
- Added new [`vue/no-duplicate-class-names`](https://eslint.vuejs.org/rules/no-duplicate-class-names.html) rule ([#2934](https://github.com/vuejs/eslint-plugin-vue/pull/2934))

### Patch Changes

- Fixed [`vue/no-v-html`](https://eslint.vuejs.org/rules/no-v-html.html) rule to allow ignoring call expressions ([#2950](https://github.com/vuejs/eslint-plugin-vue/pull/2950))
- Improved [`vue/define-macros-order`](https://eslint.vuejs.org/rules/define-macros-order.html) error messages to distinguish between macro placement and ordering issues ([#2953](https://github.com/vuejs/eslint-plugin-vue/pull/2953))
- Updated dependency [postcss-selector-parser](https://github.com/postcss/postcss-selector-parser) to v7.1.0 ([#2947](https://github.com/vuejs/eslint-plugin-vue/pull/2947))

## 10.5.1

### Patch Changes

- Fixed [`vue/no-negated-v-if-condition`](https://eslint.vuejs.org/rules/no-negated-v-if-condition.html) rule to swap entire elements ([#2941](https://github.com/vuejs/eslint-plugin-vue/pull/2941))

## 10.5.0

### Minor Changes

- Added `ignoredObjectNames` option to [`vue/no-async-in-computed-properties`](https://eslint.vuejs.org/rules/no-async-in-computed-properties.html) ([#2927](https://github.com/vuejs/eslint-plugin-vue/pull/2927))
- Added `ignorePattern` option to [`vue/no-v-html`](https://eslint.vuejs.org/rules/no-v-html.html) ([#2857](https://github.com/vuejs/eslint-plugin-vue/pull/2857))
- Added `sortLineLength` option to [`vue/attributes-order`](https://eslint.vuejs.org/rules/attributes-order.html) ([#2759](https://github.com/vuejs/eslint-plugin-vue/pull/2759))
- Changed [`vue/component-name-in-template-casing`](https://eslint.vuejs.org/rules/component-name-in-template-casing.html) `globals` option to support regex patterns ([#2928](https://github.com/vuejs/eslint-plugin-vue/pull/2928))
- Changed [`vue/valid-define-options`](https://eslint.vuejs.org/rules/valid-define-options.html) to allow local literal constant references ([#2920](https://github.com/vuejs/eslint-plugin-vue/pull/2920))
- Changed [`vue/no-mutating-props`](https://eslint.vuejs.org/rules/no-mutating-props.html) and [`vue/no-side-effects-in-computed-properties`](https://eslint.vuejs.org/rules/no-side-effects-in-computed-properties.html) rules to detect `Object.assign` mutations ([#2929](https://github.com/vuejs/eslint-plugin-vue/pull/2929))
- Added [`@stylistic/eslint-plugin`](https://eslint.style/) as optional peer dependency ([#2884](https://github.com/vuejs/eslint-plugin-vue/pull/2884))

### Patch Changes

- Changed [`vue/define-macros-order`](https://eslint.vuejs.org/rules/define-macros-order.html) to ignore enum declarations and `declare` statements ([#2918](https://github.com/vuejs/eslint-plugin-vue/pull/2918))

## 10.4.0

### Minor Changes

- Added `ignoreParents` option to [`vue/no-deprecated-slot-attribute`](https://eslint.vuejs.org/rules/no-deprecated-slot-attribute.html) ([#2784](https://github.com/vuejs/eslint-plugin-vue/pull/2784))
- Added new [`vue/no-negated-v-if-condition`](https://eslint.vuejs.org/rules/no-negated-v-if-condition.html) rule ([#2794](https://github.com/vuejs/eslint-plugin-vue/pull/2794))
- Added new [`vue/no-negated-condition`](https://eslint.vuejs.org/rules/no-negated-condition.html) rule ([#2795](https://github.com/vuejs/eslint-plugin-vue/pull/2795))

### Patch Changes

- Resolved TypeScript compatibility issues introduced by [eslint-typegen](https://github.com/antfu/eslint-typegen) ([#2790](https://github.com/vuejs/eslint-plugin-vue/pull/2790))
- Fixed inconsistent quotes in [`vue/block-lang`](https://eslint.vuejs.org/rules/block-lang.html) error messages ([#2805](https://github.com/vuejs/eslint-plugin-vue/pull/2805))

## 10.3.0

### Minor Changes

- Added [`@typescript-eslint/parser`](https://typescript-eslint.io/packages/parser) as an optional peer dependency ([#2775](https://github.com/vuejs/eslint-plugin-vue/pull/2775))
- Add TypeScript IntelliSense support via [eslint-typegen](https://github.com/antfu/eslint-typegen) ([#2770](https://github.com/vuejs/eslint-plugin-vue/pull/2770))
- [`vue/no-deprecated-slot-attribute`](https://eslint.vuejs.org/rules/no-deprecated-slot-attribute.html) `ignore` option now supports regex patterns ([#2773](https://github.com/vuejs/eslint-plugin-vue/pull/2773))

### Patch Changes

- Fixed false negatives when using typescript-eslint v8 in [`vue/script-indent`](https://eslint.vuejs.org/rules/script-indent.html) rule ([#2775](https://github.com/vuejs/eslint-plugin-vue/pull/2775))
- Update resources ([#2752](https://github.com/vuejs/eslint-plugin-vue/pull/2752))
- [`vue/no-restricted-html-elements`](https://eslint.vuejs.org/rules/no-restricted-html-elements.html) now also checks SVG and MathML elements ([#2755](https://github.com/vuejs/eslint-plugin-vue/pull/2755))

## 10.2.0

### Minor Changes

- [vue/no-restricted-html-elements](https://eslint.vuejs.org/rules/no-restricted-html-elements.html) now accepts multiple elements in each entry. ([#2750](https://github.com/vuejs/eslint-plugin-vue/pull/2750))

### Patch Changes

- Updates resources ([#2747](https://github.com/vuejs/eslint-plugin-vue/pull/2747))
