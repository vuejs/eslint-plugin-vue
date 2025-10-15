# eslint-plugin-vue

## 10.5.1

### Patch Changes

- Fixed `no-negated-v-if-condition` rule to swap entire elements ([#2941](https://github.com/vuejs/eslint-plugin-vue/pull/2941))

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
