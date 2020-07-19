## :rocket: Highlight

- Support for Vue.js 3.0 "One Piece".
- Support for ESLint 7.x.
- Support for ECMAScript 2020.
- Added 66 new rules.

## 💥 Breaking Changes

- #1209 Change support version of ESLint from 6.0.0 to 6.2.0.
- Updated presets configs.
  - Changed `plugin:vue/base` config.
    - #1237 Removed `jsx:true` from shareable configs.
    - #1209 Changed `parserOptions.ecmaVersion` to 2020.
    - #1303 Added `vue/experimental-script-setup-vars` rule.
  - Changed `plugin:vue/essential` config.
    - Same changes as above.
    - #1036 Added `vue/valid-v-bind-sync` rule.
    - #1036 Added `vue/valid-v-slot` rule.
    - #1036 Added `vue/no-custom-modifiers-on-v-model` rule.
    - #1036 Added `vue/no-multiple-template-root` rule.
    - #1036 Added `vue/no-v-model-argument` rule.
    - #1148 Added `vue/no-mutating-props` rule.
    - #1156 Added `vue/no-arrow-functions-in-watch` rule.
    - #1166 Added `vue/custom-event-name-casing` rule.
    - #1239 Added `vue/no-dupe-v-else-if` rule.
    - #1281 Added `vue/no-v-for-template-key` rule.
  - Changed `plugin:vue/strongly-recommended` config.
    - Same changes as above.
    - #1036 Added `vue/component-definition-name-casing` rule.
    - #1036 Added `vue/v-slot-style` rule.
    - #1036 Removed `vue/name-property-casing` rule.
    - #1149 Added `vue/one-component-per-file` rule.
  - Changed `plugin:vue/recommended` config.
    - Same changes as above.
    - #1036 Added `vue/component-tags-order` rule.
    - #1179 Added `vue/no-multiple-slot-args` rule.
    - #1238 Added `vue/no-lone-template` rule.
- #1036 Changed `vue/name-property-casing` rule to be deprecate.
- #1120 Added the support of descriptions in directive comments.
- #1120 Added the support for block-level directive comments.
- Changed the default order option for `vue/order-in-components` rule.
  - Add options for Vue.js 3.x.
    - #1181 `emits` to after `props`.
    - #1181 `setup` to after `emits`.
    - #1181 `beforeUnmount` and `unmounted` to LIFECYCLE_HOOKS.
    - #1181 `renderTracked` and `renderTriggered` to LIFECYCLE_HOOKS.
  - Add options for Vue.js 2.x.
    - #1181 `provide` and `inject` to after `mixins`.
    - #1181 `errorCaptured` to LIFECYCLE_HOOKS.
  - Add options for Vue Router.
    - #1107 ROUTER_GUARDS (`beforeRouteEnter`, `beforeRouteUpdate` and `beforeRouteLeave`) to after `provide / inject` (`provide / inject` was added after `mixins`).
  - Add options for Nuxt.
    - #1107 `key` to after `name`.
    - #1107 `layout`, `middleware`, `validate`, `scrollToTop`, `transition`, `loading`  to after ROUTER_GUARDS (ROUTER_GUARDS was added after `provide / inject`).
    - #1107 `watchQuery` to after `watch`.
  - Change options for Nuxt.
    - #1107 `head` move from after `methods` to after `data`.
    - #1268 `fetch` move from after `props / propsData` to after `data`.

## ✨ Enhancements

### Core:

- #1120 Added the support of descriptions in directive comments.
- #1120 Added the support for block-level directive comments.
- #1073, #1088 Updated the rules of this plugin to detect Vue.js 3.x components.
- #1064 Updated the rules of this plugin to be able to analyze the arrow function component options.
- #1152 Changed casing conversion logic to behave like Vue core logic.
- Changed `plugin:vue/essential` config.
- Changed `plugin:vue/strongly-recommended` config.
- Changed `plugin:vue/recommended` config.

### New Rulesets:

- Added `plugin:vue/vue3-essential` config.
- Added `plugin:vue/vue3-strongly-recommended` config.
- Added `plugin:vue/vue3-recommended` config.

### New Rules:

#### for Vue.js 3.x:

- #1039 Added `vue/no-deprecated-v-bind-sync` rule that reports when deprecated `.sync` modifier is used on `v-bind` directive. Related to [RFC0005]
- #1043 Added `vue/no-deprecated-filter` rule that reports usage of filters syntax removed in Vue.js 3.0.0+. Related to [RFC0015]
- #1065 Added `vue/no-ref-as-operand` rule that reports cases where a ref is used incorrectly as an operand. Related to [RFC0013]
- #1066 Added `vue/no-setup-props-destructure` rule that reports the destructuring of props passed to setup causing the value to lose reactivity. Related to [RFC0013]
- #1067 Added `vue/no-lifecycle-after-await` rule that reports the lifecycle hooks after await expression. Related to [RFC0013]
- #1079 Added `vue/no-deprecated-v-on-number-modifiers` rule that reports use of deprecated `KeyboardEvent.keyCode` modifier on `v-on` directive. Related to [RFC0014]
- #1083 Added `vue/no-deprecated-data-object-declaration` rule that reports use of deprecated object declaration on `data` property. Related to [RFC0019]
- #1097 Added `vue/no-deprecated-events-api` rule that reports use of deprecated `$on`, `$off` and `$once` api (removed in Vue.js v3.0.0+). Related to [RFC0020]
- #1068 Added `vue/no-watch-after-await` rule that reports the `watch()` after `await` expression. [RFC0013]
- #1099, #1105 Added `vue/require-toggle-inside-transition` rule that reports elements inside `<transition>` that do not control the display. Related to [RFC0017]
- #1100 Added `vue/no-deprecated-inline-template` rule that reports deprecated `inline-template` attributes (removed in Vue.js v3.0.0+) Related to [RFC0016]
- #1117 Added `vue/no-deprecated-html-element-is` rule that reports deprecated the is attribute on HTML elements (removed in Vue.js v3.0.0+). Related to [RFC0027]
- #1118 Added `vue/no-deprecated-vue-config-keycodes` rule that reports use of deprecated Vue.config.keyCodes (removed in Vue.js 3.0.0+). Related to [RFC0014]
- #1119 Added `vue/no-deprecated-functional-template` rule that reports deprecated the functional template (removed in Vue.js 3.0.0+). Related to [RFC0007]
- #1124 Added `vue/require-explicit-emits` rule that reports event triggers not declared with the emits option. Related to [RFC0030]
- #1129 Added `vue/return-in-emits-validator` rule enforces that a return statement is present in emits validators. Related to [RFC0030]
- #1130 Added `vue/no-deprecated-v-on-native-modifier` rule that reports use of deprecated `.native` modifier on `v-on` directive. Related to [RFC0031]
- #1133 Added `vue/no-deprecated-dollar-listeners-api` rule that reports use of deprecated `$listeners`. Related to [RFC0031]
- #1177 Added `vue/no-deprecated-dollar-scopedslots-api` rule that reports use of deprecated `$scopedSlots`. Related to [RFC0006]
- #1178 Added `vue/require-slots-as-functions` rule enforces the properties of $slots to be used as a function. Related to [RFC0006]
- #1211 Added `vue/no-deprecated-destroyed-lifecycle` rule reports use of deprecated `destroyed` and `beforeDestroy` lifecycle hooks.
- #1253 Added `vue/valid-v-is` rule that reports wrong usage of `v-is` directives.
- #1289 Added `vue/no-v-for-template-key-on-child` rule that reports the key of the `<template v-for>` placed on the child elements.
- #1302 Added `vue/no-deprecated-props-default-this` rule that reports the use of `this` within the props default value factory functions.
- #1303 Added `vue/experimental-script-setup-vars` rule that prevent variables defined in `<script setup>` to be marked as undefined.

#### for Vue.js 2.x:

- #1038 Added `vue/no-multiple-template-root` rule to template to check for a single root element. This rule has been separated from the previous `vue/valid-template-root` rule.
- #1039 Added `vue/no-v-model-argument` rule that does not allow argument to v-model.
- #1039 Added `vue/no-custom-modifiers-on-v-model` rule that reports when `v-model` is used with custom modifiers on Vue Component.
- #1281 Added `vue/no-v-for-template-key` rule that disallow the key placed on the `<template v-for>`. This rule has been separated from the previous `vue/no-template-key` rule.

#### Commons:

- #1086 Added `vue/no-template-no-target-blank` rule that disallows using `target="_blank"` attribute without `rel="noopener noreferrer"` to avoid a security vulnerability.
- #1114 Added `vue/no-unregistered-components` rule that disallow using components that are not registered inside templates.
- #755 Added `vue/html-comment-indent` rule that enforce consistent indentation in HTML comments.
- #755 Added `vue/html-comment-content-newline` rule that enforce unified line brake in HTML comments.
- #755 Added `vue/html-comment-content-spacing` rule that enforce unified spacing in HTML comments.
- #627 #1144 Added `vue/no-duplicate-attr-inheritance` rule that warn to apply `inheritAttrs: false` when it detects `v-bind="$attrs"` being used.
- #871 #1145 Added `vue/no-unused-properties` rule that report unused properties.
- #633 #1148 Added `vue/no-mutating-props` rule that reports mutation of component props.
- #671 Added `vue/one-component-per-file` rule that checks if there is only one component per file.
- #1072 Added `vue/no-potential-property-typo` rule that disallow a potential typo in your component options.
- #1155 Added `vue/no-arrow-functions-in-watch` rule that disallow use an arrow function to define a watcher.
- #1166 Added `vue/custom-event-name-casing` rule that enforces using kebab-case custom event names.
- #1179 Added `vue/no-multiple-slot-args` rule disallows to pass multiple arguments to scoped slots.
- #1185 Added `vue/no-bare-strings-in-template` rule that disallows the use of bare strings in `<template>`.
- #1186 Added `vue/no-useless-v-bind` rule that reports `v-bind` with a string literal value.
- #1187 Added `vue/no-useless-mustaches` rule that reports mustache interpolation with a string literal value.
- #1191 Added `vue/no-restricted-v-bind` rule that disallow specific argument in `v-bind`.
- #1192 Added `vue/no-restricted-static-attribute` rule that disallow specific attribute.
- #1213 Added `vue/no-restricted-component-options` rule that disallow specific component options.
- #1218 Added `vue/no-multiple-objects-in-class` rule disallows to pass multiple objects into array to class.
- #1222 Added `vue/no-empty-component-block` rule disallows the `<template>` `<script>` `<style>` block to be empty.
- #1238 Added `vue/no-lone-template` rule that disallow unnecessary `<template>` element.
- #1239 Added `vue/no-dupe-v-else-if` rule that disallow duplicate conditions in `v-if` / `v-else-if` chains.
- #1267 Added `vue/v-for-delimiter-style` rule that enforces which delimiter (`in` or `of`) should be used in `v-for` directives.

#### Core Extends:

- #1140 Added `vue/comma-spacing` rule that applies `comma-spacing` rule to expressions in `<template>`.
- #1141 Added `vue/prefer-template` rule that applies `prefer-template` rule to expressions in `<template>`.
- #1142 Added `vue/template-curly-spacing` rule that applies `template-curly-spacing` rule to expressions in `<template>`.
- #1157 Added `vue/space-in-parens` rule that applies `space-in-parens` rule to expressions in `<template>`.
- #1159 Added `vue/comma-style` rule that applies `comma-style` rule to expressions in `<template>`.
- #1158 Added `vue/no-extra-parens` rule that applies `no-extra-parens` rule to expressions in `<template>`.
- #1171 Added `vue/no-useless-concat` rule that applies `no-useless-concat` rule to expressions in `<template>`.
- #1173 Added `vue/dot-notation` rule that applies `dot-notation` rule to expressions in `<template>`.
- #1193 Added `vue/object-property-newline` rule that applies `object-property-newline` rule to expressions in `<template>`.
- #1194 Added `vue/object-curly-newline` rule that applies `object-curly-newline` rule to expressions in `<template>`.
- #1200 Added `vue/operator-linebreak` rule that applies `operator-linebreak` rule to expressions in `<template>`.
- #1201 Added `vue/func-call-spacing` rule that applies `func-call-spacing` rule to expressions in `<template>`.
- #1243 Added `vue/no-sparse-arrays` rule that applies `no-sparse-arrays` rule to expressions in `<template>`.

### New Options:

- #1070 Added `ignorePattern` option to `vue/no-unsed-vars` rule to disables reporting of variable names that match the regular expression.
- #1116 Added `disallowVueBuiltInComponents` and `disallowVue3BuiltInComponents` option that reports Vue built-in component names to the `vue/no-reserved-component-names` rule.
- #1167 Added `reportUnusedDisableDirectives` option to `vue/comment-directive`.
- #1162 Added `closeBracket.startTag`, `closeBracket.endTag` and `closeBracket.selfClosingTag` options to `vue/html-indent` rule.
  So that the closeBracket offset value can be set for each tag type.
- #1204 Added `ignoreIncludesComment` option to `vue/v-on-function-call` rule.
- #1212 Added `"v-model-argument"` and `"v-model-custom-modifiers"` to the syntax checked by the `vue/no-unsupported-features` rule.
- #1254 Added `"v-is"` to the syntax checked by the `vue/no-unsupported-features` rule. 

### Other Changes in Rules:

#### for Vue.js 3.x:

- #1038 Changed to remove a single root element check from `vue/valid-template-root` rule.
- #1039 Changed `vue/valid-v-model` rule to allow `v-model` argument. Related to [RFC0011]
- #1039 Changed `vue/valid-v-model` rule to allow `v-model` custom modifiers. Related to [RFC0011]
- #1082 Changed `vue/no-dupe-key`, `vue/no-reserved-keys` rules to handle `setup`.
- #1199 Changed `vue/require-direct-export` rule to allow Vue 3 functional component.
- #1181 Added the Vue.js 3.x options to the default order option for `vue/order-in-components` rule.
- #1254 Changed the `vue/attributes-order` rule to handle `v-is` as `DEFINITION` category.
- #1254 Changed the `vue/no-unregistered-components` rule to handle `v-is` like `:is`.
- #1254 Changed the `vue/no-unused-components` rule to handle `v-is` like `:is`.
- #1258 Changed to report `slot-scope` when `"^3.0.0"` is set in `vue/no-unsupported-features` rule.
- #1281 Changed `vue/no-template-key` rule to allow `v-for` key.
- #1287 Changed `vue/valid-v-for` rule to not report when placing key on `<template>`.
- #1287 Changed `vue/require-v-for-key` rule to not report when placing key on `<template>`.

#### Commons:

- #1036 Changed `vue/name-property-casing` rule to be deprecate.
- #1154 Changed `vue/no-side-effects-in-computed-properties` rule to track the `this` variable.
- #1160 Changed `vue/require-valid-default-prop` rule to track the `return` statement in the `function` defined in `default`.
- #1160 Changed `vue/require-valid-default-prop` rule to check `BigInt`.
- #1160 Improved the location of reporting errors in `vue/require-valid-default-prop` rule.
- #1162 Changed `vue/html-indent` rule to calculate the base point of the indent offset of the closing bracket of the end tag by the start tag.
- #1183 Improved autofix of `vue/order-in-components` rule to understand "Nullish Coalescing".
- #1184 Changed to not report that a value is required when parsing error for `vue/valid-v-bind-sync`, `vue/valid-v-bind`, `vue/valid-v-else-if`, `vue/valid-v-for`, `vue/valid-v-html`, `vue/valid-v-if`, `vue/valid-v-model`, `vue/valid-v-on`, `vue/valid-v-show`, `vue/valid-v-slot` and `vue/valid-v-text` rules.
- #1189 Changed `vue/component-tags-order` rule to allow name array to be specified with one order option.
- #1189 Changed the default order option for `vue/component-tags-order` rule.
- #1107 Added Nuxt and Vue Router properties to the default order option.
- #1181, #1107 Changed the default order option for `vue/order-in-components` rule.
- #1017 Added supports for ES2020 syntaxes to `vue/html-indent` and `vue/script-indent` rules.
- #1209 Added supports for Optional Chaining (ES2020) to rules.

## 🐛 Bug Fixes

- #1146 Fixed false positives for member call and autofix error in `vue/v-on-function-call` rule.
- #1152 Fixed some casing issues.
- #1164 Fixed false negatives when `v-for` and `v-slot` mixed or use destructuring for `vue/no-unused-var` rule. 
- #1190 Fixed false positives for getter/setter in `vue/no-dupe-keys` rule.
- #1204 Fixed wrong autofix in `vue/v-on-function-call` rule.
- #1208 Fixed false negatives for TemplateLiteral in `vue/prop-name-casing` rule.
- #1206 Fixed crash when `is` attribute with no value in `vue/no-unused-components` rule.
- #1242 Fixed `vue/require-valid-default-prop` and `vue/require-default-prop` rules crash on sparse arrays.
- #1262 Fixed reporting "Use the latest vue-eslint-parser" message in non-vue files.
- #1154 #1283 Fixed false positives for spread elements in `vue/no-side-effects-in-computed` rule.

----

**All commits:** [v6.2.2 -> v7.0.0](https://github.com/vuejs/eslint-plugin-vue/compare/v6.2.2...v7.0.0)

[RFC0005]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0005-replace-v-bind-sync-with-v-model-argument.md
[RFC0006]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0006-slots-unification.md
[RFC0007]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0007-functional-async-api-change.md
[RFC0011]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0011-v-model-api-change.md
[RFC0013]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md
[RFC0014]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0014-drop-keycode-support.md
[RFC0015]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0015-remove-filters.md
[RFC0016]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0016-remove-inline-templates.md
[RFC0017]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0017-transition-as-root.md
[RFC0019]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0019-remove-data-object-declaration.md
[RFC0020]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0020-events-api-change.md
[RFC0027]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0027-custom-elements-interop.md
[RFC0030]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md
[RFC0031]: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md
