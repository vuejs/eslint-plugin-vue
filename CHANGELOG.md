# eslint-plugin-vue

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
